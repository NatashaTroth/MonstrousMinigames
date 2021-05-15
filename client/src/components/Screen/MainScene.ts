import Phaser from 'phaser';

import history from '../../domain/history/history';
import { GameAudio } from '../../domain/phaser/createAudio';
import { createPlayer } from '../../domain/phaser/createPlayer';
import { GameData, Player, PlayersState } from '../../domain/phaser/gameInterfaces';
import { MessageSocket } from '../../domain/socket/MessageSocket';
import ScreenSocket from '../../domain/socket/screenSocket';
import { Socket } from '../../domain/socket/Socket';
import { SocketIOAdapter } from '../../domain/socket/SocketIOAdapter';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../domain/typeGuards/finished';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../domain/typeGuards/gameStateInfo';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../domain/typeGuards/stopped';
import { TimedOutMessage, timedOutTypeGuard } from '../../domain/typeGuards/timedOut';
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
    numberPlayersFinished: number;

    players: Array<Player>;
    trackLength: number;
    gameStarted: boolean;
    paused: boolean;
    pauseButton: undefined | Phaser.GameObjects.Text;
    gameAudio: undefined | GameAudio;

    constructor() {
        super('MainScene');
        this.roomId = '';
        this.socket = this.handleSocketConnection();
        this.posX = 50;
        this.plusX = 40;
        this.posY = window.innerHeight / 2 - 50;
        this.plusY = 110;
        this.numberPlayersFinished = 0;

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
        // createAudio(this.sound);
        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();
        this.createBackground();
        this.createPauseButton();
        // this.createPlayers();

        // use this:
        // const pausedSocket = new MessageSocket(pausedTypeGuard, this.socket);
        // pausedSocket.listen((data: GameHasPausedMessage) => {
        //     // handle Game has Paused
        //     // eslint-disable-next-line no-console
        //     console.log('paused ', data);
        // });

        const gameStateInfoSocket = new MessageSocket(gameStateInfoTypeGuard, this.socket);
        gameStateInfoSocket.listen((data: GameStateInfoMessage) => {
            if (!this.gameStarted) {
                this.gameStarted = true;
                this.handleStartGame(data.data);
            } else this.updateGameState(data.data.playersState);
        });

        const gameHasFinishedSocket = new MessageSocket(finishedTypeGuard, this.socket);
        gameHasFinishedSocket.listen((data: GameHasFinishedMessage) => {
            this.handleGameOver();
        });

        const stoppedSocket = new MessageSocket(stoppedTypeGuard, this.socket);
        stoppedSocket.listen((data: GameHasStoppedMessage) => {
            this.gameAudio?.stopMusic();
        });

        const timedOutSocket = new MessageSocket(timedOutTypeGuard, this.socket);
        timedOutSocket.listen((data: TimedOutMessage) => {
            this.gameAudio?.stopMusic();
        });

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

    createBackground() {
        const bg = this.add.image(windowWidth / 2, windowHeight / 2, 'forest');
        bg.setDisplaySize(windowWidth, windowHeight);
    }

    createPauseButton() {
        this.pauseButton = this.add.text(window.innerWidth / 2, window.innerHeight - 50, 'Pause');

        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => this.handlePauseResumeButton());
    }

    handleSocketConnection() {
        if (this.roomId == '' || this.roomId == undefined) {
            this.handleError('No room code');
        }

        return ScreenSocket.getInstance(new SocketIOAdapter(this.roomId, 'screen')).socket;
    }

    handleStartGame(gameStateData: GameData) {
        this.trackLength = gameStateData.trackLength;

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            createPlayer(i, gameStateData, this);

            // this.players[i].playerText?.setBackgroundColor('#000000');
            // this.setGoal(i);
        }
    }

    handlePauseResumeButton() {
        //TODO connect to backend
        if (this.paused) {
            //TODO emit to server. this.resumeGame is then called by handle message when resume event comes in
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame() {
        // this.socket?.emit({ type: MessageTypes.pauseResume }); //TODO
        this.pauseButton?.setText('Resume');

        for (let i = 0; i < this.players.length; i++) {
            // this.stopRunningAnimation(players[i], i);
            this.players[i].phaserObject.anims.pause();
        }

        this.paused = true;
    }

    resumeGame() {
        for (let i = 0; i < this.players.length; i++) {
            // players[i].anims.play(animations[i])
            if (!this.paused) {
                this.players[i].phaserObject.anims.play(this.players[i].animationName);
                // this.startRunningAnimation(players[i], i);
            }
        }
        this.pauseButton?.setText('Pause');
        this.paused = false;
    }

    // setGoal(playerIndex: number) {
    //     const goal = this.physics.add.sprite(this.trackLength, this.getYPosition(playerIndex), 'goal');
    //     goal.setScale(0.1, 0.1);
    //     goals.push(goal);
    // }

    mapServerXToWindowX(positionX: number, trackLength: number) {
        return (positionX * (window.innerWidth - 200)) / trackLength;
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

    removePlayerSprite(index: number) {
        this.players[index].phaserObject.destroy();
    }

    updateGameState(playerData: PlayersState[]) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].phaserObject !== undefined && playerData !== undefined) {
                this.moveForward(this.players[i].phaserObject, playerData[i].positionX, i);
                this.checkAtObstacle(i, playerData[i].atObstacle, playerData[i].positionX);
                this.checkFinished(i, playerData[i].finished);
            }
        }
    }

    checkFinished(playerIndex: number, isFinished: boolean) {
        if (isFinished) {
            // players[playerIndex].anims.stop();
            this.stopRunningAnimation(this.players[playerIndex].phaserObject, playerIndex);
            this.numberPlayersFinished++;
        }
    }

    handleGameOver() {
        //end of game
        // if(this.numberPlayersFinished >= players.length){

        // this.backgroundMusicLoop?.stop();
        this.gameAudio?.stopMusic();
        // this.sound.add('backgroundMusicEnd', { volume: 0.2 });
        history.push(`/screen/${this.roomId}/finished`);
        // }
    }

    checkAtObstacle(playerIndex: number, isAtObstacle: boolean, playerPositionX: number) {
        if (isAtObstacle && !this.players[playerIndex].playerAtObstacle) {
            this.stopRunningAnimation(this.players[playerIndex].phaserObject, playerIndex);
            this.players[playerIndex].playerAtObstacle = true;

            this.addAttentionIcon(playerIndex);
        } else if (!isAtObstacle && this.players[playerIndex].playerAtObstacle && !this.paused) {
            this.players[playerIndex].playerAtObstacle = false;
            this.startRunningAnimation(this.players[playerIndex].phaserObject, playerIndex);
            this.destroyObstacle(playerIndex, playerPositionX);
            this.destroyAttentionIcon(playerIndex);
        }
    }

    addAttentionIcon(playerIndex: number) {
        if (!this.players[playerIndex].playerAttention) {
            this.players[playerIndex].playerAttention = this.physics.add
                .sprite(
                    this.players[playerIndex].phaserObject.x + 75,
                    this.players[playerIndex].phaserObject.y - 150,
                    'attention'
                )
                .setDepth(100)
                .setScale(0.03, 0.03);
        }
    }

    destroyAttentionIcon(playerIndex: number) {
        this.players[playerIndex].playerAttention?.destroy();
        this.players[playerIndex].playerAttention = null;
    }

    destroyObstacle(playerIndex: number, playerPositionX: number) {
        if (this.players[playerIndex].playerObstacles.length > 0) {
            this.players[playerIndex].playerObstacles[0].destroy();
            this.players[playerIndex].playerObstacles.shift();
        }
    }

    startRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.play(this.players[playerIdx].animationName);
        this.players[playerIdx].playerRunning = true;
    }
    stopRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.stop();
        this.players[playerIdx].playerRunning = false;
    }

    moveForward(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, toX: number, playerIndex: number) {
        toX = this.mapServerXToWindowX(toX, this.trackLength);
        if (toX == player.x) {
            this.players[playerIndex].playerCountSameDistance++; // if idle for more than a second - means actually stopped, otherwise could just be waiting for new
        } else {
            this.players[playerIndex].playerCountSameDistance = 0;
            if (!this.players[playerIndex].playerRunning) {
                this.startRunningAnimation(player, playerIndex);
            }
        }

        if (this.players[playerIndex].playerRunning && this.players[playerIndex].playerCountSameDistance > 100) {
            //TODO HANDLE
            // this.stopRunningAnimation(player, playerIndex);
            // this.playerCountSameDistance[playerIndex] = 0;
        }

        if (!this.paused) {
            player.x = toX;
        }

        // this.playerText[playerIndex]?.x = toX; //- 100;
        // this.test++;

        // if (this.test == 100) {
        //     this.test = 0;
        //     // eslint-disable-next-line no-console
        //     console.log(`${player.x}   ${this.playerText[playerIndex].x}`);
        // }
    }
}

export default MainScene;
