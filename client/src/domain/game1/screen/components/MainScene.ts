import Phaser from 'phaser';

import chasersSpritesheet from '../../../../images/characters/spritesheets/chasers/chasers_spritesheet.png';
import windSpritesheet from '../../../../images/characters/spritesheets/chasers/wind_spritesheet.png';
import { designDevelopment, localDevelopment, MessageTypes, MessageTypesGame1 } from '../../../../utils/constants';
import { screenFinishedRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { GameToScreenMapper } from '../../../phaser/game1/GameToScreenMapper';
import { initialGameInput } from '../../../phaser/game1/initialGameInput';
import { Player } from '../../../phaser/game1/Player';
import { PhaserPlayerRenderer } from '../../../phaser/game1/renderer/PhaserPlayerRenderer';
import { GameAudio } from '../../../phaser/GameAudio';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { GameEventTypes } from '../../../phaser/GameEventTypes';
import { GameData } from '../../../phaser/gameInterfaces';
import { PhaserGameRenderer } from '../../../phaser/renderer/PhaserGameRenderer';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../../typeGuards/finished';
import {
    AllScreensPhaserGameLoadedMessage,
    allScreensPhaserGameLoadedTypeGuard,
} from '../../../typeGuards/game1/allScreensPhaserGameLoaded';
import {
    ApproachingSolvableObstacleOnceMessage,
    approachingSolvableObstacleOnceTypeGuard,
} from '../../../typeGuards/game1/approachingSolvableObstacleOnceTypeGuard';
import { ChasersPushedMessage, ChasersPushedTypeGuard } from '../../../typeGuards/game1/chasersPushed';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../../typeGuards/game1/gameStateInfo';
import {
    InitialGameStateInfoMessage,
    initialGameStateInfoTypeGuard,
} from '../../../typeGuards/game1/initialGameStateInfo';
import { ObstacleSkippedMessage, obstacleSkippedTypeGuard } from '../../../typeGuards/game1/obstacleSkipped';
import {
    ObstacleWillBeSolvedMessage,
    obstacleWillBeSolvedTypeGuard,
} from '../../../typeGuards/game1/obstacleWillBeSolved';
import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../../typeGuards/game1/phaserLoadingTimedOut';
import { GameHasStartedMessage, startedTypeGuard } from '../../../typeGuards/game1/started';
import { GameHasPausedMessage, pausedTypeGuard } from '../../../typeGuards/paused';
import { GameHasResumedMessage, resumedTypeGuard } from '../../../typeGuards/resumed';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../../typeGuards/stopped';
import { moveLanesToCenter } from '../gameState/moveLanesToCenter';
import { audioFiles, characters, fireworkFlares, images } from './GameAssets';

class MainScene extends Phaser.Scene {
    windowWidth: number;
    windowHeight: number;
    roomId: string;
    socket?: Socket;
    posX: number;
    plusX: number;
    posY: number;
    plusY: number;
    players: Array<Player>;
    trackLength: number;
    gameStarted: boolean;
    paused: boolean;
    gameRenderer?: PhaserGameRenderer;
    gameAudio?: GameAudio;
    camera?: Phaser.Cameras.Scene2D.Camera;
    cameraSpeed: number;
    gameEventEmitter: GameEventEmitter;
    screenAdmin: boolean;
    gameToScreenMapper?: GameToScreenMapper;
    firstGameStateReceived: boolean;
    allScreensLoaded: boolean;

    constructor() {
        super('MainScene');
        this.windowWidth = 0;
        this.windowHeight = 0;

        this.roomId = sessionStorage.getItem('roomId') || '';
        this.posX = 50;
        this.plusX = 40;
        this.posY = 0;
        this.plusY = 110;
        this.players = [];
        this.trackLength = 5000;
        this.gameStarted = false;
        this.paused = false;
        this.cameraSpeed = 2;
        this.gameEventEmitter = GameEventEmitter.getInstance();
        this.screenAdmin = false;
        this.firstGameStateReceived = false;
        this.allScreensLoaded = false;
    }

    init(data: { roomId: string; socket: Socket; screenAdmin: boolean }) {
        this.camera = this.cameras.main;
        this.windowWidth = this.cameras.main.width;
        this.windowHeight = this.cameras.main.height;
        this.posY = this.windowHeight / 2 - 50;
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
            this.socket?.emit({
                type: MessageTypesGame1.phaserLoaded,
                roomId: this.roomId,
            });
        });

        audioFiles.forEach(audio => this.load.audio(audio.name, audio.file));

        characters.forEach(character => {
            this.load.spritesheet(character.name, character.file, character.properties);
        });

        this.load.spritesheet('chasersSpritesheet', chasersSpritesheet, {
            frameWidth: 1240,
            frameHeight: 876,
            startFrame: 0,
            endFrame: 5,
        });

        this.load.spritesheet('windSpritesheet', windSpritesheet, {
            frameWidth: 1240,
            frameHeight: 690,
            startFrame: 0,
            endFrame: 5,
        });

        images.forEach(image => {
            this.load.image(image.name, image.file);
        });

        fireworkFlares.forEach((flare, i) => {
            this.load.image(`flare${i}`, flare);
        });
    }

    create() {
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
        handleStartGame(this.socket, this.roomId);
    }

    initSockets() {
        if (!this.socket) return;
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

        const allScreensPhaserGameLoaded = new MessageSocket(allScreensPhaserGameLoadedTypeGuard, this.socket);
        allScreensPhaserGameLoaded.listen((data: AllScreensPhaserGameLoadedMessage) => {
            if (this.screenAdmin) this.sendCreateNewGame();
        });

        const approachingObstacle = new MessageSocket(approachingSolvableObstacleOnceTypeGuard, this.socket);
        approachingObstacle.listen((data: ApproachingSolvableObstacleOnceMessage) => {
            this.players.find(player => player.userId === data.userId)?.handleApproachingObstacle();
        });

        const obstacleSkipped = new MessageSocket(obstacleSkippedTypeGuard, this.socket);
        obstacleSkipped.listen((data: ObstacleSkippedMessage) => {
            this.players.find(player => player.userId === data.userId)?.handleObstacleSkipped();
        });

        const obstacleWillBeSolved = new MessageSocket(obstacleWillBeSolvedTypeGuard, this.socket);
        obstacleWillBeSolved.listen((data: ObstacleWillBeSolvedMessage) => {
            this.players.find(player => player.userId === data.userId)?.destroyWarningIcon();
        });

        const phaserLoadedTimedOut = new MessageSocket(phaserLoadingTimedOutTypeGuard, this.socket);
        phaserLoadedTimedOut.listen((data: PhaserLoadingTimedOutMessage) => {
            //TODO handle ?
        });

        const startedGame = new MessageSocket(startedTypeGuard, this.socket);
        startedGame.listen((data: GameHasStartedMessage) => {
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

        const chasersPushedSocket = new MessageSocket(ChasersPushedTypeGuard, this.socket);
        const xPositions: number[] = [];
        const yPositions: number[] = [];
        this.players.forEach(element => {
            if (!element.dead) {
                xPositions.push(element.coordinates.x);
                yPositions.push(element.coordinates.x);
            }
        });

        chasersPushedSocket.listen((data: ChasersPushedMessage) => {
            this.players.forEach(player => {
                player.renderer.renderWind();
            });
        });

        //TODO
        // gameHasReset

        // if ((data.type == 'error' && data.msg !== undefined) || !data.data) {
        //     this.handleError(data.msg);
        //     return;
        // }
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
        this.gameToScreenMapper = new GameToScreenMapper(gameStateData.playersState[0].positionX, this.windowWidth);
        this.trackLength = gameStateData.trackLength;

        this.physics.world.setBounds(
            0,
            0,
            this.gameToScreenMapper!.mapGameMeasurementToScreen(this.trackLength + 150),
            this.windowHeight
        );

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);
        }

        if (this.camera)
            this.camera.scrollX = this.gameToScreenMapper.mapGameMeasurementToScreen(gameStateData.cameraPositionX);
    }

    updateGameState(gameStateData: GameData) {
        for (let i = 0; i < this.players.length; i++) {
            if (gameStateData.playersState[i].dead) {
                if (!this.players[i].finished) {
                    this.players[i].handlePlayerDead();
                }
            } else if (gameStateData.playersState[i].finished) {
                if (!this.players[i].finished) {
                    this.players[i].handlePlayerFinished();
                }
            } else if (gameStateData.playersState[i].stunned) {
                this.players[i].handlePlayerStunned();
            } else {
                if (this.players[i].stunned) {
                    this.players[i].handlePlayerUnStunned();
                }

                this.players[i].moveForward(gameStateData.playersState[i].positionX);
                this.players[i].checkAtObstacle(gameStateData.playersState[i].atObstacle);
            }
            this.players[i].setChasers(gameStateData.chasersPositionX);
        }

        this.moveCamera(gameStateData.cameraPositionX);
    }

    moveCamera(posX: number) {
        if (this.camera) {
            this.camera.scrollX = this.gameToScreenMapper!.mapGameMeasurementToScreen(posX);
            this.camera.setBounds(
                0,
                0,
                this.gameToScreenMapper!.mapGameMeasurementToScreen(this.trackLength + 150),
                this.windowHeight
            ); //+150 so the cave can be fully seen
        }
    }

    private createPlayer(index: number, gameStateData: GameData) {
        const character = characters[gameStateData.playersState[index].characterNumber];
        const numberPlayers = gameStateData.playersState.length;
        const laneHeightsPerNumberPlayers = [1 / 3, 2 / 3, 1, 1];
        const laneHeight = (this.windowHeight / numberPlayers) * laneHeightsPerNumberPlayers[numberPlayers - 1];
        const posY = moveLanesToCenter(this.windowHeight, laneHeight, index, numberPlayers);

        const player = new Player(
            this,
            laneHeight,
            index,
            { x: gameStateData.playersState[index].positionX, y: posY },
            gameStateData,
            character,
            numberPlayers,
            this.gameToScreenMapper!,
            new PhaserPlayerRenderer(this, numberPlayers, laneHeightsPerNumberPlayers)
        );
        this.players.push(player);
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
        handleResume(this.socket);
    }

    handleStopGame() {
        handleStop(this.socket);
    }
}

export default MainScene;

export function handleResume(socket: Socket | undefined) {
    socket?.emit({ type: MessageTypes.pauseResume });
}

export function handleStartGame(socket: Socket | undefined, roomId: string | undefined) {
    socket?.emit({
        type: MessageTypes.startGame,
        roomId,
    });
}

export function handleStop(socket: Socket | undefined) {
    socket?.emit({ type: MessageTypes.stopGame });
}
