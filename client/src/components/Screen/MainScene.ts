import Phaser from 'phaser';

import history from '../../domain/history/history';
import { GameAudio } from '../../domain/phaser/GameAudio';
import GameEventEmitter from '../../domain/phaser/GameEventEmitter';
import { GameEventTypes } from '../../domain/phaser/GameEventTypes';
import { GameData } from '../../domain/phaser/gameInterfaces';
import { Player } from '../../domain/phaser/Player';
// import print from '../../domain/phaser/printMethod';
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
import { PlayerFinishedMessage, playerFinishedTypeGuard } from '../../domain/typeGuards/playerFinished';
import { GameHasResumedMessage, resumedTypeGuard } from '../../domain/typeGuards/resumed';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../domain/typeGuards/stopped';
import { TimedOutMessage, timedOutTypeGuard } from '../../domain/typeGuards/timedOut';
import { MessageTypes } from '../../utils/constants';
import { audioFiles, characters, images } from './GameAssets';

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
        this.roomId = '';
        this.socket = this.handleSocketConnection();
        this.posX = 50;
        this.plusX = 40;
        this.posY = window.innerHeight / 2 - 50;
        this.plusY = 110;
        this.players = [];
        this.trackLength = 2000;
        this.gameStarted = false;
        this.paused = false;
        this.cameraSpeed = 0.5;
        this.gameEventEmitter = GameEventEmitter.getInstance();
    }

    init(data: { roomId: string }) {
        this.camera = this.cameras.main;
        if (this.roomId === '' && data.roomId !== undefined) this.roomId = data.roomId;
    }

    preload(): void {
        audioFiles.forEach(audio => this.load.audio(audio.name, audio.file));

        characters.forEach(character => {
            this.load.spritesheet(character.name, character.file, character.properties);
        });

        images.forEach(image => {
            this.load.image(image.name, image.file);
        });
    }

    create() {
        this.gameRenderer = new PhaserGameRenderer(this);
        this.gameRenderer?.renderBackground(windowWidth, windowHeight, this.trackLength);
        this.gameRenderer?.renderPauseButton();
        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();
        this.initiateSockets();
        this.initiateEventEmitters();
    }

    handleSocketConnection() {
        if (this.roomId == '' || this.roomId == undefined) {
            this.handleError('No room code');
        }

        return ScreenSocket.getInstance(new SocketIOAdapter(this.roomId, 'screen')).socket;
    }

    initiateSockets() {
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
                this.gameStarted = true;
                this.handleStartGame(data.data);
            } else this.updateGameState(data.data);
        });

        const playerFinishedSocket = new MessageSocket(playerFinishedTypeGuard, this.socket);
        playerFinishedSocket.listen((data: PlayerFinishedMessage) => {
            this.players[data.userId].checkFinished(true);
        });

        const gameHasFinishedSocket = new MessageSocket(finishedTypeGuard, this.socket);
        gameHasFinishedSocket.listen((data: GameHasFinishedMessage) => {
            this.gameAudio?.stopMusic();
            history.push(`/screen/${this.roomId}/finished`);
        });

        const stoppedSocket = new MessageSocket(stoppedTypeGuard, this.socket);
        stoppedSocket.listen((data: GameHasStoppedMessage) => {
            this.gameAudio?.stopMusic();
        });

        const timedOutSocket = new MessageSocket(timedOutTypeGuard, this.socket);
        timedOutSocket.listen((data: TimedOutMessage) => {
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
    }

    handleStartGame(gameStateData: GameData) {
        this.trackLength = gameStateData.trackLength;

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);
            // this.setGoal(i);
        }
    }

    updateGameState(gameStateData: GameData) {
        this.players.forEach((player, i) => {
            player.moveForward(gameStateData.playersState[i].positionX, this.trackLength);
            player.checkAtObstacle(gameStateData.playersState[i].atObstacle);
            player.checkDead(gameStateData.playersState[i].dead)
            player.setChasers(gameStateData.chasersPositionX)
            // eslint-disable-next-line no-console
            console.log(gameStateData)
            player.checkFinished(gameStateData.playersState[i].finished);
        });
        this.moveCamera();
    }

    moveCamera() {
        if (this.camera) {
            this.camera.scrollX += this.cameraSpeed;
            this.camera.setBounds(0, 0, this.trackLength, windowHeight);
        }
    }

    private createPlayer(index: number, gameStateData: GameData) {
        const character = characters[index];
        const posX = this.posX + this.plusX * index;
        const posY = this.posY + this.plusY * index;

        const player = new Player(
            new PhaserPlayerRenderer(this),
            index,
            { x: posX, y: posY },
            gameStateData,
            character.name
        );
        this.players.push(player);
    }

    handlePauseResumeButton() {
        this.socket?.emit({ type: MessageTypes.pauseResume });
    }

    private pauseGame() {
        this.paused = true;
        this.gameRenderer?.pauseGame();
        this.players.forEach(player => {
            player.stopRunning();
        });
    }

    private resumeGame() {
        this.paused = false;
        this.gameRenderer?.resumeGame();
        this.players.forEach(player => {
            player.startRunning();
        });
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
