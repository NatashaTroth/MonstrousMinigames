import Phaser from 'phaser';

import history from '../../domain/history/history';
import { GameAudio } from '../../domain/phaser/GameAudio';
import GameEventEmitter from '../../domain/phaser/GameEventEmitter';
import { GameEventTypes } from '../../domain/phaser/GameEventTypes';
import { GameData } from '../../domain/phaser/gameInterfaces';
import { Player } from '../../domain/phaser/Player';
import printMethod from '../../domain/phaser/printMethod';
import { GameRenderer } from '../../domain/phaser/renderer/GameRenderer';
import { PhaserGameRenderer } from '../../domain/phaser/renderer/PhaserGameRenderer';
import { PhaserPlayerRenderer } from '../../domain/phaser/renderer/PhaserPlayerRenderer';
import { MessageSocket } from '../../domain/socket/MessageSocket';
import ScreenSocket from '../../domain/socket/screenSocket';
import { Socket } from '../../domain/socket/Socket';
import { SocketIOAdapter } from '../../domain/socket/SocketIOAdapter';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../domain/typeGuards/finished';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../domain/typeGuards/gameStateInfo';
import { GameHasPausedMessage, pausedTypeGuard } from '../../domain/typeGuards/paused';
import { GameHasResumedMessage, resumedTypeGuard } from '../../domain/typeGuards/resumed';
import { GameHasStartedMessage, startedTypeGuard } from '../../domain/typeGuards/started';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../domain/typeGuards/stopped';
import { MessageTypes } from '../../utils/constants';
import { screenFinishedRoute } from '../../utils/routes';
import { audioFiles, characters, fireworkFlares, images } from './GameAssets';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
class MainScene extends Phaser.Scene {
    roomId: string;
    socket: Socket;
    posX: number;
    plusX: number;
    posY: number;
    plusY: number;
    players: Array<Player>;
    trackLength: number;
    gameStarted: boolean;
    paused: boolean;
    gameRenderer?: GameRenderer;
    gameAudio?: GameAudio;
    camera?: Phaser.Cameras.Scene2D.Camera;
    cameraSpeed: number;
    gameEventEmitter: GameEventEmitter;

    constructor() {
        super('MainScene');
        this.roomId = sessionStorage.getItem('roomId') || '';
        this.socket = this.handleSocketConnection();
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
    }

    init(data: { roomId: string }) {
        this.camera = this.cameras.main;
        if (this.roomId === '' && data.roomId !== undefined) {
            this.roomId = data.roomId;
        }
    }

    preload(): void {
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

        // this.load.atlas('flares', flaresPng, flaresJson);

        //TODO Loading bar: https://www.patchesoft.com/phaser-3-loading-screen
        // this.load.on('progress', this.updateBar);
    }

    create() {
        this.gameRenderer = new PhaserGameRenderer(this);
        this.gameRenderer?.renderBackground(windowWidth, windowHeight, this.trackLength);
        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();
        this.initiateSockets();
        this.initiateEventEmitters();

        this.sendStartGame();
    }

    handleSocketConnection() {
        if (this.roomId == '' || this.roomId == undefined) {
            this.handleError('No room code');
        }

        return ScreenSocket.getInstance(new SocketIOAdapter(this.roomId, 'screen')).socket;
    }

    sendStartGame() {
        printMethod('SEND START GAME');
        //TODO!!!! - do not send when game is already started? - or is it just ignored - appears to work - maybe check if no game state updates?
        printMethod('SEND START GAME');
        this.socket?.emit({
            type: MessageTypes.startGame,
            roomId: this.roomId,
            // userId: sessionStorage.getItem('userId'), //TODO
        });
    }

    initiateSockets() {
        const startedGame = new MessageSocket(startedTypeGuard, this.socket);
        const decrementCounter = (counter: number) => counter - 1000;
        startedGame.listen((data: GameHasStartedMessage) => {
            printMethod('RECEIVED START GAME');

            let countdownValue = data.countdownTime - 1000; //to keep in track with server (1 sec less to start roughly at the same time as the server)
            const countdownInterval = setInterval(() => {
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
            }, 1000);
        });

        const pausedSocket = new MessageSocket(pausedTypeGuard, this.socket);
        pausedSocket.listen((data: GameHasPausedMessage) => {
            this.pauseGame();
        });

        const resumedSocket = new MessageSocket(resumedTypeGuard, this.socket);
        resumedSocket.listen((data: GameHasResumedMessage) => {
            this.resumeGame();
        });

        const gameStateInfoSocket = new MessageSocket(gameStateInfoTypeGuard, this.socket);
        gameStateInfoSocket.listen((data: GameStateInfoMessage) => {
            if (!this.gameStarted) {
                printMethod('RECEIVED FIRST GAME STATE:');
                printMethod(data.data);
                this.gameStarted = true;
                this.handleStartGame(data.data);
            } else this.updateGameState(data.data);
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

    handleStartGame(gameStateData: GameData) {
        this.trackLength = gameStateData.trackLength;
        this.gameRenderer?.renderBackground(windowWidth, windowHeight, this.trackLength);

        this.physics.world.setBounds(0, 0, 7500, windowHeight);

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);
        }

        if (this.camera) this.camera.scrollX = gameStateData.cameraPositionX;
    }

    updateGameState(gameStateData: GameData) {
        for (let i = 0; i < this.players.length; i++) {
            if (gameStateData.playersState[i].dead) {
                if (!this.players[i].finished) {
                    this.players[i].handlePlayerDead();
                    this.gameRenderer?.handleLanePlayerDead(i);
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
            if (gameStateData.chasersAreRunning) this.players[i].setChasers(gameStateData.chasersPositionX);
        }

        this.moveCamera(gameStateData.cameraPositionX);
    }

    moveCamera(posX: number) {
        if (this.camera) {
            this.camera.scrollX = posX;
            this.camera.setBounds(0, 0, this.trackLength, windowHeight); //+150 so the cave can be fully seen
            this.players.forEach(player => {
                player.renderer.updatePlayerNamePosition(posX, this.trackLength)
            });
        }
            
    }

    private createPlayer(index: number, gameStateData: GameData) {
        const character = characters[gameStateData.playersState[index].characterNumber];
        const posX = this.posX + this.plusX;
        const posY = index * (window.innerHeight / 4) + this.plusY - 50;

        const player = new Player(
            new PhaserPlayerRenderer(this),
            index,
            { x: posX, y: posY },
            gameStateData,
            character.name
        );
        this.players.push(player);
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
