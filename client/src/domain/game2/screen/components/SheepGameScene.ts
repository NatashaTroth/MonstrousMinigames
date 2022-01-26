/* eslint-disable no-console */
import Phaser from 'phaser';

import { GamePhases, PlayerRank } from '../../../../contexts/game2/Game2ContextProvider';
import sheepSpritesheet from '../../../../images/characters/spritesheets/sheep/sheep_spritesheet.png';
import { designDevelopment, localDevelopment, MessageTypes, MessageTypesGame2 } from '../../../../utils/constants';
import { GameData } from '../../../phaser/game2/gameInterfaces/GameData';
import { GameToScreenMapper } from '../../../phaser/game2/GameToScreenMapper';
import { initialGameInput } from '../../../phaser/game2/initialGameInput';
import { Player } from '../../../phaser/game2/Player';
import { GameTwoRenderer } from '../../../phaser/game2/renderer/GameTwoRenderer';
import { Sheep, SheepState } from '../../../phaser/game2/Sheep';
import { GameAudio } from '../../../phaser/GameAudio';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { GameEventTypes } from '../../../phaser/GameEventTypes';
import { PhaserGame } from '../../../phaser/PhaserGame';
import { PhaserGameRenderer } from '../../../phaser/renderer/PhaserGameRenderer';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../../typeGuards/finished';
import {
    AllScreensSheepGameLoadedMessage,
    allScreensSheepGameLoadedTypeGuard,
} from '../../../typeGuards/game2/allScreensSheepGameLoaded';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../../typeGuards/game2/gameStateInfo';
import {
    InitialGameStateInfoMessage,
    initialGameStateInfoTypeGuard,
} from '../../../typeGuards/game2/initialGameStateInfo';
import { PhaseChangedMessage, phaseChangedTypeGuard } from '../../../typeGuards/game2/phaseChanged';
import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../../typeGuards/game2/phaserLoadingTimedOut';
import { PlayerRanksMessage, playerRanksTypeGuard } from '../../../typeGuards/game2/playerRanks';
import { SheepGameHasStartedMessage, sheepGameStartedTypeGuard } from '../../../typeGuards/game2/started';
import { GameHasPausedMessage, pausedTypeGuard } from '../../../typeGuards/paused';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../../typeGuards/stopped';
import { resumeHandler } from '../gameState/resumeHandler';
import { audioFiles, characters, images } from './GameAssets';

class SheepGameScene extends Phaser.Scene {
    windowWidth: number;
    windowHeight: number;
    roomId: string;
    socket?: Socket;
    controllerSocket?: Socket;
    players: Array<Player>;
    sheep: Array<Sheep>;
    phase: GamePhases;
    gameStarted: boolean;
    paused: boolean;
    gameRenderer?: PhaserGameRenderer;
    gameAudio?: GameAudio;
    camera?: Phaser.Cameras.Scene2D.Camera;
    gameEventEmitter: GameEventEmitter;
    screenAdmin: boolean;
    gameToScreenMapper?: GameToScreenMapper;
    firstGameStateReceived: boolean;
    allScreensLoaded: boolean;
    playerRanks: PlayerRank[];
    gameTwoRenderer?: GameTwoRenderer;
    socketsInitiated = false;

    constructor() {
        super(PhaserGame.SCENE_NAME_GAME_2);
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.roomId = sessionStorage.getItem('roomId') || '';
        this.players = [];
        this.sheep = [];
        this.phase = GamePhases.counting;
        this.gameStarted = false;
        this.paused = false;
        this.gameEventEmitter = GameEventEmitter.getInstance();
        this.screenAdmin = false;
        this.firstGameStateReceived = false;
        this.allScreensLoaded = false;
        this.playerRanks = [];
        this.initiateEventEmitters();
    }

    resetSceneVariables() {
        this.players = [];
        this.sheep = [];
        this.phase = GamePhases.counting;
        this.gameStarted = false;
        this.paused = false;
        this.firstGameStateReceived = false;
        this.allScreensLoaded = false;
        this.playerRanks = [];
    }

    init(data: { roomId: string; socket: Socket; screenAdmin: boolean }) {
        this.resetSceneVariables();
        this.windowWidth = this.cameras.main.width;
        this.windowHeight = this.cameras.main.height;
        this.camera = this.cameras.main;
        this.socket = data.socket;
        this.screenAdmin = data.screenAdmin;
        this.gameRenderer = new PhaserGameRenderer(this);
        this.gameTwoRenderer = new GameTwoRenderer(this);

        if (!this.socketsInitiated) this.initSockets();

        if (this.roomId === '' && data.roomId !== undefined) {
            this.roomId = data.roomId;
        }
    }

    preload(): void {
        if (!designDevelopment) {
            this.gameRenderer?.renderLoadingScreen();
            // emitted every time a file has been loaded
            this.load.on('progress', (value: number) => {
                this.gameRenderer?.updateLoadingScreenPercent(value);
            });
        }

        if (designDevelopment) {
            // emitted every time a file has been loaded
            this.load.on('fileprogress', (file: unknown) => {
                this.gameRenderer?.fileProgressUpdate(file);
            });
        }

        audioFiles.forEach(audio => this.load.audio(audio.name, audio.file));

        characters.forEach(character => {
            this.load.spritesheet(character.name, character.file, character.properties);
        });

        images.forEach(image => {
            this.load.image(image.name, image.file);
        });

        this.load.spritesheet('sheepSpritesheet', sheepSpritesheet, {
            frameWidth: 124,
            frameHeight: 124,
            startFrame: 0,
            endFrame: 37,
        });
    }

    create() {
        this.gameRenderer?.updateLoadingScreenFinishedPreloading();
        // first message sent
        this.socket?.emit({
            type: MessageTypesGame2.phaserLoaded,
            roomId: this.roomId,
        });

        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();

        if (localDevelopment && designDevelopment) {
            this.initiateGame(initialGameInput);
        }
    }

    sendCreateNewGame() {
        this.socket?.emit({
            type: MessageTypes.createGame,
            roomId: this.roomId,
        });
    }

    sendStartGame() {
        //TODO!!!! - do not send when game is already started? - or is it just ignored - appears to work - maybe check if no game state updates?
        this.socket?.emit({
            type: MessageTypes.startGame,
            roomId: this.roomId,
            // userId: sessionStorage.getItem('userId'), //TODO
        });
    }

    initSockets() {
        if (!this.socket) return;

        this.socketsInitiated = true;

        if (!designDevelopment) {
            const initialGameStateInfoSocket = new MessageSocket(initialGameStateInfoTypeGuard, this.socket);
            initialGameStateInfoSocket.listen((data: InitialGameStateInfoMessage) => {
                this.gameRenderer?.destroyLoadingScreen();
                this.gameStarted = true;
                this.initiateGame(data.data);
                this.camera?.setBackgroundColor('rgba(0, 0, 0, 0)');
                if (this.screenAdmin && !designDevelopment) this.sendStartGame();
            });
        }

        const allScreensSheepGameLoaded = new MessageSocket(allScreensSheepGameLoadedTypeGuard, this.socket);
        allScreensSheepGameLoaded.listen((data: AllScreensSheepGameLoadedMessage) => {
            if (this.screenAdmin) this.sendCreateNewGame();
        });

        const phaserLoadedTimedOut = new MessageSocket(phaserLoadingTimedOutTypeGuard, this.socket);
        phaserLoadedTimedOut.listen((data: PhaserLoadingTimedOutMessage) => {
            //TODO handle
        });

        const startedGame = new MessageSocket(sheepGameStartedTypeGuard, this.socket);
        startedGame.listen((data: SheepGameHasStartedMessage) => {
            if (this.notCurrentGameScene()) return;
            this.createGameCountdown(data.countdownTime);
        });

        const gameStateInfoSocket = new MessageSocket(gameStateInfoTypeGuard, this.socket);
        gameStateInfoSocket.listen((data: GameStateInfoMessage) => {
            this.updateGameState(data.data);
        });

        const phaseChangeSocket = new MessageSocket(phaseChangedTypeGuard, this.socket);
        phaseChangeSocket.listen((data: PhaseChangedMessage) => {
            this.updateGamePhase(data);
        });

        const playerRanksSocket = new MessageSocket(playerRanksTypeGuard, this.socket);
        playerRanksSocket.listen((data: PlayerRanksMessage) => {
            this.updatePlayerRanks(data);
        });

        const pausedSocket = new MessageSocket(pausedTypeGuard, this.socket);
        pausedSocket.listen((data: GameHasPausedMessage) => {
            if (this.notCurrentGameScene()) return;
            this.pauseGame();
        });

        const resumeHandlerWithDependencies = resumeHandler({ scene: this });
        resumeHandlerWithDependencies(this.socket);

        const gameHasFinishedSocket = new MessageSocket(finishedTypeGuard, this.socket);
        gameHasFinishedSocket.listen((data: GameHasFinishedMessage) => {
            if (this.notCurrentGameScene()) return;
            this.gameAudio?.stopMusic();
            this.scene.stop();
            // history.push(screenFinishedRoute(this.roomId));
        });

        const stoppedSocket = new MessageSocket(stoppedTypeGuard, this.socket);
        stoppedSocket.listen((data: GameHasStoppedMessage) => {
            if (this.notCurrentGameScene()) return;
            this.gameAudio?.stopMusic();
            this.scene.stop();
        });
    }

    private notCurrentGameScene() {
        return PhaserGame.getInstance().currentScene !== PhaserGame.SCENE_NAME_GAME_2;
    }

    initiateEventEmitters() {
        this.gameEventEmitter.on(GameEventTypes.PauseAudio, () => {
            this.gameAudio?.pause();
        });

        this.gameEventEmitter.on(GameEventTypes.PlayAudio, () => {
            this.gameAudio?.resume();
        });

        this.gameEventEmitter.on(GameEventTypes.PauseResume, () => {
            this.handlePauseResumeButton();
        });

        this.gameEventEmitter.on(GameEventTypes.Stop, () => {
            this.handleStopGame();
        });
    }

    initiateGame(gameStateData: GameData) {
        this.gameToScreenMapper = new GameToScreenMapper(
            gameStateData.lengthX,
            this.windowWidth,
            gameStateData.lengthY,
            this.windowHeight
        );

        this.physics.world.setBounds(
            0,
            this.gameToScreenMapper.getScreenYOffset() - 150, //- 200, -> so that monster can go to the top of the field, but does not work, probably because backend stops at position 0
            this.windowWidth,
            this.gameToScreenMapper.getMappedGameHeight() + 150 // + 200
        );

        const yPadding = 30; //padding, so bottom of character/sheep don't hang over edge
        this.gameTwoRenderer?.renderSheepBackground(
            this.gameToScreenMapper.getCenterOffsetX(),
            this.gameToScreenMapper.getScreenYOffset() - yPadding,
            this.gameToScreenMapper.getMappedGameWidth(),
            this.gameToScreenMapper.getMappedGameHeight() + yPadding * 2
        );

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);
        }

        for (let i = 0; i < gameStateData.sheep.length; i++) {
            this.createSheep(i, gameStateData);
        }
        this.gameTwoRenderer?.renderBrightnessOverlay(this.windowWidth, this.windowHeight);
    }

    updateGameState(gameStateData: GameData) {
        for (let i = 0; i < this.players.length; i++) {
            if (gameStateData.playersState[i]) {
                this.players[i].moveTo(
                    gameStateData.playersState[i].positionX,
                    gameStateData.playersState[i].positionY
                );
            }
        }
        for (let i = 0; i < this.sheep.length; i++) {
            if (gameStateData.sheep[i]) {
                this.sheep[i].renderer.moveSheep(
                    this.gameToScreenMapper?.mapGameXMeasurementToScreen(gameStateData.sheep[i].posX),
                    this.gameToScreenMapper?.mapGameYMeasurementToScreen(gameStateData.sheep[i].posY)
                );
                if (gameStateData.sheep[i].state && gameStateData.sheep[i].state === SheepState.DECOY) {
                    this.sheep[i].renderer.placeDecoy();
                } else if (gameStateData.sheep[i].state === SheepState.DEAD) {
                    this.sheep[i].renderer.destroySheep();
                }
            }
        }
        this.gameTwoRenderer?.updateBrightnessOverlay(gameStateData.brightness);
    }

    updateGamePhase(data: PhaseChangedMessage) {
        this.phase = data.phase;

        switch (this.phase) {
            case GamePhases.guessing:
                this.sheep.forEach(sheep => {
                    sheep.renderer.setSheepVisible(false);
                });
                this.gameTwoRenderer?.renderGuessText(true);
                return;
            case GamePhases.results:
                this.gameTwoRenderer?.renderGuessText(false);
                // TODO
                return;
            default:
                this.gameRenderer?.destroyLeaderboard();
                this.sheep.forEach(sheep => {
                    sheep.renderer.setSheepVisible(true);
                });
                this.gameTwoRenderer?.renderRoundCount(data.round);
                return;
        }
    }

    updatePlayerRanks(data: PlayerRanksMessage) {
        this.playerRanks = data.playerRanks;
        this.gameRenderer?.renderLeaderboard(this.playerRanks);
        this.controllerSocket?.emit({
            type: MessageTypesGame2.playerRanks,
            roomId: this.roomId,
            playerRanks: data.playerRanks,
        });
    }

    private createPlayer(index: number, gameStateData: GameData) {
        const character = characters[gameStateData.playersState[index].characterNumber];
        const numberPlayers = gameStateData.playersState.length;
        const player = new Player(
            this,
            index,
            { x: gameStateData.playersState[index].positionX, y: gameStateData.playersState[index].positionY },
            gameStateData,
            character,
            numberPlayers,
            this.gameToScreenMapper!
        );
        this.players.push(player);
    }

    private createSheep(index: number, gameStateData: GameData) {
        const sheep = new Sheep(
            this,
            index,
            { x: gameStateData.sheep[index].posX, y: gameStateData.sheep[index].posY },
            gameStateData,
            this.gameToScreenMapper!
        );
        this.sheep.push(sheep);
    }

    private createGameCountdown(countdownTime: number) {
        const decrementCounter = (counter: number) => counter - 1000;
        let countdownValue = countdownTime;

        const updateCountdown = () => {
            if (countdownValue > 0) {
                this.gameRenderer?.renderCountdown((countdownValue / 1000).toString());
                countdownValue = decrementCounter(countdownValue);
            } else if (countdownValue === 0) {
                //only render go for 1 sec
                this.gameRenderer?.renderCountdown('Go!');
                countdownValue = decrementCounter(countdownValue);
            } else {
                this.gameRenderer?.destroyCountdown();
                clearInterval(countdownInterval);
                this.createInitialSheepCount();
            }
        };

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    private createInitialSheepCount() {
        if (this.gameTwoRenderer) {
            this.gameTwoRenderer.renderInitialSheepCount(this.sheep.length);
            setTimeout(() => this.gameTwoRenderer!.destroyInitialSheepCount(), 3000);
        }
    }

    private pauseGame() {
        this.paused = true;
        this.players.forEach(player => {
            player.stopRunning();
        });
        this.scene.pause();
        this.gameAudio?.pause();
    }

    handlePauseResumeButton() {
        if (PhaserGame.getInstance().currentScene !== PhaserGame.SCENE_NAME_GAME_2) return;
        this.socket?.emit({ type: MessageTypes.pauseResume });
    }

    handleStopGame() {
        handleStop(this.socket);
    }

    handleError(msg = 'Something went wrong.') {
        // this.add.text(32, 32, `Error: ${msg}`, { font: '30px Arial' });
        // this.players.forEach(player => {
        //     player.phaserObject.destroy();
        // });
        // this.players.forEach(player => {
        //     player.playerObstacles.forEach(obstacle => {
        //         obstacle.destroy();
        //     });
        // });
        // this.backgroundMusicLoop?.stop();
        // obstacles.forEach(obstacle => {
        //     obstacle.destroy();
        // });
    }
}

export default SheepGameScene;

function handleStop(socket: Socket | undefined) {
    socket?.emit({ type: MessageTypes.stopGame });
}
