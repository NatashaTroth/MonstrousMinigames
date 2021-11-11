import Phaser from 'phaser';

import sheepSpritesheet from '../../../../images/characters/spritesheets/sheep/sheep_spritesheet.png';
import { designDevelopment, localDevelopment, MessageTypes, MessageTypesGame2 } from '../../../../utils/constants';
import { screenFinishedRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { GameData } from '../../../phaser/game2/gameInterfaces/GameData';
import { GameToScreenMapper } from '../../../phaser/game2/GameToScreenMapper';
import { initialGameInput } from '../../../phaser/game2/initialGameInput';
import { Player } from '../../../phaser/game2/Player';
import { Sheep } from '../../../phaser/game2/Sheep';
import { GameAudio } from '../../../phaser/GameAudio';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { GameEventTypes } from '../../../phaser/GameEventTypes';
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
import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../../typeGuards/game2/phaserLoadingTimedOut';
import { SheepGameHasStartedMessage, sheepGameStartedTypeGuard } from '../../../typeGuards/game2/started';
import { GameHasPausedMessage, pausedTypeGuard } from '../../../typeGuards/paused';
import { GameHasResumedMessage, resumedTypeGuard } from '../../../typeGuards/resumed';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../../typeGuards/stopped';
import { audioFiles, characters, images } from './GameAssets';

const windowHeight = window.innerHeight;
class SheepGameScene extends Phaser.Scene {
    windowWidth: number;
    windowHeight: number;
    roomId: string;
    socket?: Socket;
    posX: number;
    posY: number;
    players: Array<Player>;
    sheep: Array<Sheep>;
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

    constructor() {
        super('SheepGameScene');
        this.windowWidth = 0;
        this.windowHeight = 0;
        this.roomId = sessionStorage.getItem('roomId') || '';
        this.posX = 0;
        this.posY = 0; //TODO get from backend
        this.players = [];
        this.sheep = [];
        this.gameStarted = false;
        this.paused = false;
        this.gameEventEmitter = GameEventEmitter.getInstance();
        this.screenAdmin = false;
        this.firstGameStateReceived = false;
        this.allScreensLoaded = false;
    }

    init(data: { roomId: string; socket: Socket; screenAdmin: boolean }) {
        this.windowWidth = this.cameras.main.width;
        this.windowHeight = this.cameras.main.height;
        this.camera = this.cameras.main;
        this.socket = data.socket;
        this.screenAdmin = data.screenAdmin;
        this.gameRenderer = new PhaserGameRenderer(this);
        this.initSockets();
        this.initiateEventEmitters();

        if (this.roomId === '' && data.roomId !== undefined) {
            this.roomId = data.roomId;
        }
    }

    preload(): void {
        this.gameRenderer?.renderLoadingScreen();
        // emitted every time a file has been loaded
        this.load.on('progress', (value: number) => {
            this.gameRenderer?.updateLoadingScreenPercent(value);
        });

        if (designDevelopment) {
            // emitted every time a file has been loaded
            this.load.on('fileprogress', (file: unknown) => {
                this.gameRenderer?.fileProgressUpdate(file);
            });
        }

        //once all the files are done loading
        this.load.on('complete', () => {
            this.gameRenderer?.updateLoadingScreenFinishedPreloading();
            // first message sent
            this.socket?.emit({
                type: MessageTypesGame2.phaserLoaded,
                roomId: this.roomId,
            });
        });

        audioFiles.forEach(audio => this.load.audio(audio.name, audio.file));

        characters.forEach(character => {
            this.load.spritesheet(character.name, character.file, character.properties);
        });

        images.forEach(image => {
            this.load.image(image.name, image.file);
        });

        this.load.spritesheet('sheepSpritesheet', sheepSpritesheet, {
            frameWidth: 2480,
            frameHeight: 2480,
            startFrame: 0,
            endFrame: 17,
        });
    }

    create() {
        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();
        // this.initSockets();
        // this.initiateEventEmitters();

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
            type: MessageTypesGame2.startSheepGame,
            roomId: this.roomId,
            // userId: sessionStorage.getItem('userId'), //TODO
        });
    }

    initSockets() {
        if (!this.socket) return; //TODO - handle error - although think ok
        if (!designDevelopment) {
            const initialGameStateInfoSocket = new MessageSocket(initialGameStateInfoTypeGuard, this.socket);
            initialGameStateInfoSocket.listen((data: InitialGameStateInfoMessage) => {
                this.gameRenderer?.destroyLoadingScreen();
                this.gameStarted = true;
                this.initiateGame(data.data);
                this.camera?.setBackgroundColor('rgba(0, 0, 0, 0)');
                // third message -> start Game
                if (this.screenAdmin && !designDevelopment) this.sendStartGame();
            });
            // this.firstGameStateReceived = true;
        }

        // second message -> createGame
        const allScreensSheepGameLoaded = new MessageSocket(allScreensSheepGameLoadedTypeGuard, this.socket);
        allScreensSheepGameLoaded.listen((data: AllScreensSheepGameLoadedMessage) => {
            //this.allScreensLoaded = true
            if (this.screenAdmin) this.sendCreateNewGame();
        });

        const phaserLoadedTimedOut = new MessageSocket(phaserLoadingTimedOutTypeGuard, this.socket);
        phaserLoadedTimedOut.listen((data: PhaserLoadingTimedOutMessage) => {
            //TODO handle
        });

        const startedGame = new MessageSocket(sheepGameStartedTypeGuard, this.socket);
        startedGame.listen((data: SheepGameHasStartedMessage) => {
            this.createGameCountdown(data.countdownTime);
        });

        const gameStateInfoSocket = new MessageSocket(gameStateInfoTypeGuard, this.socket);
        gameStateInfoSocket.listen((data: GameStateInfoMessage) => {
            this.updateGameState(data.data);
        });

        const pausedSocket = new MessageSocket(pausedTypeGuard, this.socket);
        pausedSocket.listen((data: GameHasPausedMessage) => {
            this.pauseGame();
        });

        const resumedSocket = new MessageSocket(resumedTypeGuard, this.socket);
        resumedSocket.listen((data: GameHasResumedMessage) => {
            this.resumeGame();
        });

        const gameHasFinishedSocket = new MessageSocket(finishedTypeGuard, this.socket);
        gameHasFinishedSocket.listen((data: GameHasFinishedMessage) => {
            this.gameAudio?.stopMusic();
            history.push(screenFinishedRoute(this.roomId));
        });

        const stoppedSocket = new MessageSocket(stoppedTypeGuard, this.socket);
        stoppedSocket.listen((data: GameHasStoppedMessage) => {
            this.gameAudio?.stopMusic();
        });
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
    }

    initiateGame(gameStateData: GameData) {
        // eslint-disable-next-line no-console
        console.log(gameStateData);
        this.gameToScreenMapper = new GameToScreenMapper(gameStateData.playersState[0].positionX, this.windowWidth, 0);

        this.physics.world.setBounds(0, 0, 7500, windowHeight);

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);
        }

        for (let i = 0; i < gameStateData.sheep.length; i++) {
            this.createSheep(i, gameStateData);
        }
    }

    updateGameState(gameStateData: GameData) {
        //TODO
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
        // eslint-disable-next-line no-console
        console.log(gameStateData.sheep[index]);
        const numberOfSheep = gameStateData.sheep.length;
        const sheep = new Sheep(
            this,
            index,
            { x: gameStateData.sheep[index].posX, y: gameStateData.sheep[index].posY },
            gameStateData,
            numberOfSheep,
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
            }
        };

        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
    }

    private pauseGame() {
        this.paused = true;
        this.players.forEach(player => {
            player.stopRunning();
        });
        this.scene.pause();
        this.gameAudio?.pause();
    }

    private resumeGame() {
        this.paused = false;
        this.players.forEach(player => {
            player.startRunning();
        });
        this.scene.resume();
        this.gameAudio?.resume();
    }

    handlePauseResumeButton() {
        this.socket?.emit({ type: MessageTypes.pauseResume });
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

    //TODO stop game button
    // function handleStopGame() {
    //     screenSocket?.emit({ type: MessageTypes.stopGame });
    // }
}

export default SheepGameScene;
