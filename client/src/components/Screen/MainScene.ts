import Phaser from 'phaser';

import { createBackground } from '../../domain/phaser/createBackground';
import { GameAudio } from '../../domain/phaser/GameAudio';
import { GameData } from '../../domain/phaser/gameInterfaces';
import { PauseButton } from '../../domain/phaser/PauseButton';
import { Player } from '../../domain/phaser/Player';
import { PhaserPlayerRenderer } from '../../domain/phaser/renderer/PhaserPlayerRenderer';
import { MessageSocket } from '../../domain/socket/MessageSocket';
import ScreenSocket from '../../domain/socket/screenSocket';
import { Socket } from '../../domain/socket/Socket';
import { SocketIOAdapter } from '../../domain/socket/SocketIOAdapter';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../domain/typeGuards/gameStateInfo';
import { audioFiles, characters, images } from './GameAssets';

// const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

class MainScene extends Phaser.Scene {
    roomId: string;
    socket: Socket;
    posX: number;
    plusX: number;
    posY: number;
    plusY: number;
    // numberPlayersFinished: number;

    players: Array<Player>;
    trackLength: number;
    gameStarted: boolean;
    paused: boolean;
    pauseButton: undefined | PauseButton;
    gameAudio: undefined | GameAudio;
    newPlayers: any;

    constructor() {
        super('MainScene');
        this.roomId = '';
        this.socket = this.handleSocketConnection();
        this.posX = 50;
        this.plusX = 40;
        this.posY = window.innerHeight / 2 - 50;
        this.plusY = 110;
        // this.numberPlayersFinished = 0;

        this.players = [];
        this.trackLength = 2000;
        this.gameStarted = false;
        this.paused = false;
        this.pauseButton = undefined;
        this.gameAudio = undefined;
    }

    init(data: { roomId: string }) {
        if (this.roomId === '' && data.roomId !== undefined) this.roomId = data.roomId;
        // this.socket = this.handleSocketConnection();
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
        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();
        createBackground(this.add, windowWidth, windowHeight);
        this.pauseButton = new PauseButton(this);
        this.initiateSockets();
    }

    handleSocketConnection() {
        //TODO
        if (this.roomId == '' || this.roomId == undefined) {
            this.handleError('No room code');
        }

        return ScreenSocket.getInstance(new SocketIOAdapter(this.roomId, 'screen')).socket;
    }

    initiateSockets() {
        // use this:
        // const pausedSocket = new MessageSocket(pausedTypeGuard, this.socket);
        // pausedSocket.listen((data: GameHasPausedMessage) => {
        //     // handle Game has Paused
        //     // eslint-disable-next-line no-console
        //     console.log('paused ', data);
        // });
        const gameStateInfoSocket = new MessageSocket(gameStateInfoTypeGuard, this.socket);
        gameStateInfoSocket.listen((data: GameStateInfoMessage) => {
            //todo
            if (!this.gameStarted) {
                this.gameStarted = true;
                this.handleStartGame(data.data);
            }
            // else updateGameState(data.data.playersState, this);
        });
        // const gameHasFinishedSocket = new MessageSocket(finishedTypeGuard, this.socket);
        // gameHasFinishedSocket.listen((data: GameHasFinishedMessage) => {
        //     this.gameAudio?.stopMusic();
        //     history.push(`/screen/${this.roomId}/finished`);
        // });
        // const stoppedSocket = new MessageSocket(stoppedTypeGuard, this.socket);
        // stoppedSocket.listen((data: GameHasStoppedMessage) => {
        //     this.gameAudio?.stopMusic();
        // });
        // const timedOutSocket = new MessageSocket(timedOutTypeGuard, this.socket);
        // timedOutSocket.listen((data: TimedOutMessage) => {
        //     this.gameAudio?.stopMusic();
        // });
        //         obstacle
        // playerFinished
        // gameHasReset
        // gameHasPaused
        // gameHasResumed
        //     if ((data.type == 'error' && data.msg !== undefined) || !data.data) {
        //         this.handleError(data.msg);
        //         return;
        //     }
    }

    handleStartGame(gameStateData: GameData) {
        this.trackLength = gameStateData.trackLength;

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);
            // print('here');
            // this.players[i].playerText?.setBackgroundColor('#000000');
            // this.setGoal(i);
        }
    }

    // createPlayer(index: number, gameStateData: GameData, PhaserInstance: MainScene) {
    //     const character = characters[index];
    //     const posX = PhaserInstance.posX + PhaserInstance.plusX * index;
    //     const posY = PhaserInstance.posY + PhaserInstance.plusY * index;

    //     const player = PhaserInstance.physics.add
    //         .sprite(posX, posY, character.name)
    //         .setDepth(50)
    //         .setBounce(0.2)
    //         .setCollideWorldBounds(true)
    //         .setScale(0.15, 0.15)
    //         .setCollideWorldBounds(true);

    //     PhaserInstance.players.push({
    //         name: gameStateData.playersState[index].name,
    //         animationName: `${character.name}Walk`,
    //         phaserObject: player,
    //         playerRunning: false,
    //         playerAtObstacle: false,
    //         playerObstacles: handleSetObstacles({
    //             obstaclesDetails: gameStateData.playersState[index].obstacles,
    //             posY,
    //             physics: PhaserInstance.physics,
    //             trackLength: PhaserInstance.trackLength,
    //         }),
    //         playerCountSameDistance: 0,
    //         playerAttention: null, //TODO change
    //         playerText: PhaserInstance.add
    //             .text(
    //                 posX, //+ 50
    //                 posY - 100,
    //                 character.name,
    //                 { font: '16px Arial', align: 'center', fixedWidth: 150 }
    //             )
    //             .setDepth(50),
    //     });

    //     PhaserInstance.anims.create({
    //         key: `${character.name}Walk`,
    //         frames: PhaserInstance.anims.generateFrameNumbers(character.name, { start: 12, end: 15 }),
    //         frameRate: 6,
    //         repeat: -1,
    //     });

    //     // return players,
    // }

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
        //return player.player;
    }

    // setGoal(playerIndex: number) {
    //     const goal = this.physics.add.sprite(this.trackLength, this.getYPosition(playerIndex), 'goal');
    //     goal.setScale(0.1, 0.1);
    //     goals.push(goal);
    // }

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

    // removePlayerSprite(index: number) {
    //     this.players[index].phaserObject.destroy();
    // }

    // checkFinished(playerIndex: number, isFinished: boolean) {
    //     if (isFinished) {
    //         // players[playerIndex].anims.stop();
    //         this.stopRunningAnimation(this.players[playerIndex].phaserObject, playerIndex);
    //         this.numberPlayersFinished++;
    //     }
    // }

    checkAtObstacle(playerIndex: number, isAtObstacle: boolean, playerPositionX: number) {
        //TODO
        // if (isAtObstacle && !this.players[playerIndex].playerAtObstacle) {
        //     this.stopRunningAnimation(this.players[playerIndex].renderer.player, playerIndex);
        //     this.players[playerIndex].playerAtObstacle = true;
        //     addAttentionIcon(playerIndex, this.players, this.physics);
        // } else if (!isAtObstacle && this.players[playerIndex].playerAtObstacle && !this.paused) {
        //     this.players[playerIndex].playerAtObstacle = false;
        //     this.startRunningAnimation(this.players[playerIndex].phaserObject, playerIndex);
        //     this.destroyObstacle(playerIndex, playerPositionX);
        //     destroyAttentionIcon(playerIndex, this.players);
        // }
    }

    // addAttentionIcon(playerIndex: number) {
    //     if (!this.players[playerIndex].playerAttention) {
    //         this.players[playerIndex].playerAttention = this.physics.add
    //             .sprite(
    //                 this.players[playerIndex].phaserObject.x + 75,
    //                 this.players[playerIndex].phaserObject.y - 150,
    //                 'attention'
    //             )
    //             .setDepth(100)
    //             .setScale(0.03, 0.03);
    //     }
    // }

    // destroyAttentionIcon(playerIndex: number) {
    //     this.players[playerIndex].playerAttention?.destroy();
    //     this.players[playerIndex].playerAttention = null;
    // }

    // destroyObstacle(playerIndex: number, playerPositionX: number) {
    //     if (this.players[playerIndex].playerObstacles.length > 0) {
    //         this.players[playerIndex].playerObstacles[0].destroy();
    //         this.players[playerIndex].playerObstacles.shift();
    //     }
    // }

    startRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.play(this.players[playerIdx].animationName);
        this.players[playerIdx].playerRunning = true;
    }
    stopRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.stop();
        this.players[playerIdx].playerRunning = false;
    }
}

export default MainScene;
