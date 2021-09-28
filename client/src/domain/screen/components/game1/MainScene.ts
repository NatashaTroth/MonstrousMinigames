import Phaser from 'phaser';

import { designDevelopment, localDevelopment, MessageTypes, MessageTypesGame1 } from '../../../../utils/constants';
import { screenFinishedRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import { MessageSocket } from '../../../socket/MessageSocket';
import { Socket } from '../../../socket/Socket';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../../typeGuards/finished';
import {
    AllScreensPhaserGameLoadedMessage,
    allScreensPhaserGameLoadedTypeGuard,
} from '../../../typeGuards/game1/allScreensPhaserGameLoaded';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../../typeGuards/game1/gameStateInfo';
import {
    InitialGameStateInfoMessage,
    initialGameStateInfoTypeGuard,
} from '../../../typeGuards/game1/initialGameStateInfo';
import {
    PhaserLoadingTimedOutMessage,
    phaserLoadingTimedOutTypeGuard,
} from '../../../typeGuards/game1/phaserLoadingTimedOut';
import { GameHasStartedMessage, startedTypeGuard } from '../../../typeGuards/game1/started';
import { GameHasPausedMessage, pausedTypeGuard } from '../../../typeGuards/paused';
import { GameHasResumedMessage, resumedTypeGuard } from '../../../typeGuards/resumed';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../../typeGuards/stopped';
import { GameAudio } from '../../phaser/GameAudio';
import GameEventEmitter from '../../phaser/GameEventEmitter';
import { GameEventTypes } from '../../phaser/GameEventTypes';
import { GameData } from '../../phaser/gameInterfaces';
import { GameToScreenMapper } from '../../phaser/GameToScreenMapper';
import { initialGameInput } from '../../phaser/initialGameInput';
import { Player } from '../../phaser/Player';
import printMethod from '../../phaser/printMethod';
import { PhaserGameRenderer } from '../../phaser/renderer/PhaserGameRenderer';
import { audioFiles, characters, fireworkFlares, images } from './GameAssets';

const windowHeight = window.innerHeight;
class MainScene extends Phaser.Scene {
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
        this.roomId = sessionStorage.getItem('roomId') || '';
        this.posX = 50;
        this.plusX = 40;
        this.posY = window.innerHeight / 2 - 50;
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
            printMethod('LOADING COMPLETE - SENDING TO SERVER');
            // if (localDevelopment && this.screenAdmin) return;

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
        // this.initSockets();
        // this.initiateEventEmitters();

        if (localDevelopment && designDevelopment) {
            this.initiateGame(initialGameInput);
        }

        //TODO change
        // if (!designDevelopment) {
        //     // setTimeout(() => {
        //     //     this.sendStartGame();
        //     // }, 5000);
        // }
    }

    // handleSocketConnection() {
    //     if (this.roomId == '' || this.roomId == undefined) {
    //         this.handleError('No room code');
    //     }

    //     return ScreenSocket.getInstance(new SocketIOAdapter(this.roomId, 'screen')).socket;
    // }

    sendCreateNewGame() {
        printMethod('**ADMIN SCREEN**');
        printMethod('SEND CREATE GAME');
        this.socket?.emit({
            type: MessageTypesGame1.createGame,
            roomId: this.roomId,
        });
    }

    sendStartGame() {
        printMethod('SEND START GAME');
        //TODO!!!! - do not send when game is already started? - or is it just ignored - appears to work - maybe check if no game state updates?
        this.socket?.emit({
            type: MessageTypes.startGame,
            roomId: this.roomId,
            // userId: sessionStorage.getItem('userId'), //TODO
        });
    }

    initSockets() {
        if (!this.socket) return; //TODO - handle error - although think ok
        if (!designDevelopment) {
            const initialGameStateInfoSocket = new MessageSocket(initialGameStateInfoTypeGuard, this.socket);
            initialGameStateInfoSocket.listen((data: InitialGameStateInfoMessage) => {
                printMethod('RECEIVED FIRST GAME STATE:');
                // printMethod(JSON.stringify(data.data));
                this.gameRenderer?.destroyLoadingScreen();

                this.gameStarted = true;
                this.initiateGame(data.data);
                this.camera?.setBackgroundColor('rgba(0, 0, 0, 0)');
                if (this.screenAdmin && !designDevelopment) this.sendStartGame();
            });
            // this.firstGameStateReceived = true;
        }

        const allScreensPhaserGameLoaded = new MessageSocket(allScreensPhaserGameLoadedTypeGuard, this.socket);
        allScreensPhaserGameLoaded.listen((data: AllScreensPhaserGameLoadedMessage) => {
            printMethod('RECEIVED All screens loaded');
            // this.allScreensLoaded = true;
            if (this.screenAdmin) this.sendCreateNewGame();
            // if (this.screenAdmin && !designDevelopment && this.firstGameStateReceived) this.sendStartGame();
        });

        const phaserLoadedTimedOut = new MessageSocket(phaserLoadingTimedOutTypeGuard, this.socket);
        phaserLoadedTimedOut.listen((data: PhaserLoadingTimedOutMessage) => {
            printMethod('TIMED OUT');
            //TODO handle
        });

        const startedGame = new MessageSocket(startedTypeGuard, this.socket);
        startedGame.listen((data: GameHasStartedMessage) => {
            printMethod('RECEIVED START GAME');

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
    }

    initiateGame(gameStateData: GameData) {
        this.gameToScreenMapper = new GameToScreenMapper(
            gameStateData.playersState[0].positionX,
            gameStateData.chasersPositionX
        );
        // const otherTrackLength = this.mapGameMeasurementToScene(gameStateData.trackLength)

        this.trackLength = gameStateData.trackLength;

        // this.gameRenderer?.renderBackground(windowWidth, windowHeight, this.trackLength);

        this.physics.world.setBounds(0, 0, 7500, windowHeight);

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
                    // this.gameRenderer?.handleLanePlayerDead(i); //TODO
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

                this.players[i].moveForward(gameStateData.playersState[i].positionX, this.trackLength);
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
                windowHeight
            ); //+150 so the cave can be fully seen
            // this.players.forEach(player => {
            //     player.renderer.updatePlayerNamePosition(posX, this.trackLength);
            // });
        }
    }

    private createPlayer(index: number, gameStateData: GameData) {
        const character = characters[gameStateData.playersState[index].characterNumber];
        const numberPlayers = gameStateData.playersState.length;
        const laneHeightsPerNumberPlayers = [1 / 3, 2 / 3, 1, 1];
        const laneHeight = (windowHeight / numberPlayers) * laneHeightsPerNumberPlayers[numberPlayers - 1];
        const posY = this.moveLanesToCenter(windowHeight, laneHeight, index, numberPlayers);

        const player = new Player(
            this,
            laneHeightsPerNumberPlayers,
            laneHeight,
            index,
            { x: gameStateData.playersState[index].positionX, y: posY },
            gameStateData,
            character,
            numberPlayers,
            this.gameToScreenMapper!
        );
        this.players.push(player);
    }

    //TODO duplicate, also in phaserPlayerRenderer.ts
    private moveLanesToCenter(windowHeight: number, newHeight: number, index: number, numberPlayers: number) {
        return (windowHeight - newHeight * numberPlayers) / 2 + newHeight * (index + 1);
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

export default MainScene;
