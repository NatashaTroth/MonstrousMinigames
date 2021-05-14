import Phaser from 'phaser';
import { stringify } from 'querystring';

import { MessageTypes } from '../../utils/constants';
import history from '../../utils/history';
import { audioFiles, characters, images } from './GameAssets';
import { GameData, ObstacleDetails, PlayersState, SocketMessage } from './gameInterfaces';
import { Player } from './gameInterfaces/Player';

// const players: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
// const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];

let roomId = '';
const moveplayers = [true, true, true, true];
//let obstaclesCleared = [0,0,0,0]
let socket: SocketIOClient.Socket;
const animations = ['franzWalk', 'susiWalk', 'noahWalk', 'steffiWalk'];

// let logged = false;
let paused = false;

// let logged = 0;

let pauseButton: undefined | Phaser.GameObjects.Text;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
class MainScene extends Phaser.Scene {
    posX: number;
    plusX: number;
    posY: number;
    plusY: number;
    numberPlayersFinished: number;
    backgroundMusicLoop: undefined | Phaser.Sound.BaseSound;
    rightKey: undefined | Phaser.Input.Keyboard.Key;
    players: Array<Player>;
    trackLength: number;
    gameStarted: boolean;

    constructor() {
        super('MainScene');
        this.posX = 50;
        this.plusX = 40;
        this.posY = window.innerHeight / 2 - 50;
        this.plusY = 110;
        this.numberPlayersFinished = 0;
        this.backgroundMusicLoop = undefined;
        this.rightKey = undefined;
        this.players = [];
        this.trackLength = 2000;
        this.gameStarted = false;
    }

    init(data: { roomId: string; socketConnection: SocketIOClient.Socket }) {
        if (roomId === '' && data.roomId !== undefined) {
            roomId = data.roomId;
        }
        if (data.socketConnection) socket = data.socketConnection;
        else socket = this.handleSocketConnection();
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
        this.createAudio();
        this.createBackground();
        this.createPauseButton();
        // this.createPlayers();

        // this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    createAudio() {
        const backgroundMusicStart = this.sound.add('backgroundMusicStart', {
            volume: 0.2,
        });

        this.backgroundMusicLoop = this.sound.add('backgroundMusicLoop', {
            volume: 0.2,
        });

        backgroundMusicStart.play({ loop: false });
        backgroundMusicStart.once('complete', () => {
            this.backgroundMusicLoop?.play({ loop: true });
        });
    }

    createBackground() {
        const bg = this.add.image(windowWidth / 2, windowHeight / 2, 'forest');
        bg.setDisplaySize(windowWidth, windowHeight);
    }

    createPauseButton() {
        pauseButton = this.add.text(window.innerWidth / 2, window.innerHeight - 50, 'Pause');
        // // eslint-disable-next-line no-console
        // console.log(pauseButton);

        pauseButton.setInteractive();
        pauseButton.on('pointerdown', this.handlePauseResumeButton);
    }

    handleSocketConnection() {
        if (roomId == '' || roomId == undefined) {
            this.handleError('No room code');
        }
        const socket = io(
            `${process.env.REACT_APP_BACKEND_URL}screen?${stringify({
                roomId: roomId,
            })}`,
            {
                secure: true,
                reconnection: true,
                rejectUnauthorized: false,
                reconnectionDelayMax: 10000,
                transports: ['websocket'],
            }
        );
        return socket;
    }

    handleMessage(data: SocketMessage) {
        // //TODO delete
        // if (this.rightKey?.isDown) {
        //     this.moveForward(players[0], players[0].x + 50, 0);
        // }

        // if (logged < 5) {
        //     logged += 1;
        // }

        if ((data.type == 'error' && data.msg !== undefined) || !data.data) {
            this.handleError(data.msg);
            return;
        }
        // eslint-disable-next-line no-console
        // console.log(data.type);

        switch (data.type) {
            case MessageTypes.gameState:
                if (!this.gameStarted) {
                    // eslint-disable-next-line no-console
                    console.log('start game');
                    this.gameStarted = true;
                    this.handleStartGame(data.data);
                }

                // this.handleGameStateUpdate(data.data);
                this.updateGameState(data.data.playersState);
                break;
            case MessageTypes.obstacle:
                break;
            case MessageTypes.playerFinished:
                break;
            case MessageTypes.gameHasReset:
                break;
            case MessageTypes.gameHasPaused:
                break;
            case MessageTypes.gameHasResumed:
                break;
            case MessageTypes.gameHasTimedOut:
            case MessageTypes.gameHasStopped:
                this.backgroundMusicLoop?.stop();
                break;
            case MessageTypes.gameHasFinished:
                this.handleGameOver();

                break;
        }

        // if (trackLength === 0 && data !== undefined && data.data !== undefined) {
        //     trackLength = data.data.trackLength;
        // }
        // if (!roomId && data.data !== undefined) {
        //     roomId = data.data.roomId;
        // }
    }

    handleStartGame(gameStateData: GameData) {
        this.trackLength = gameStateData.trackLength;

        for (let i = 0; i < gameStateData.playersState.length; i++) {
            this.createPlayer(i, gameStateData);

            // this.players[i].playerText?.setBackgroundColor('#000000');
            // this.setGoal(i);
        }
    }

    createPlayer(index: number, gameStateData: GameData) {
        const character = characters[index];

        const posX = this.posX + this.plusX * index;
        const posY = this.posY + this.plusY * index;

        const player = this.physics.add
            .sprite(posX, posY, character.name)
            .setDepth(50)
            .setBounce(0.2)
            .setCollideWorldBounds(true)
            .setScale(0.15, 0.15)
            .setCollideWorldBounds(true);

        this.players.push({
            phaserObject: player,
            playerRunning: false,
            playerAtObstacle: false,
            playerObstacles: this.setObstacles(index, gameStateData.playersState[index].obstacles),
            playerCountSameDistance: 0,
            playerAttention: null, //TODO change
            playerText: this.add
                .text(
                    posX, //+ 50
                    posY - 100,
                    character.name,
                    { font: '16px Arial', align: 'center', fixedWidth: 150 }
                )
                .setDepth(50),
        });

        this.anims.create({
            key: `${character.name}Walk`,
            frames: this.anims.generateFrameNumbers(character.name, { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1,
        });
    }

    handlePauseResumeButton() {
        //TODO connect to backend
        if (paused) {
            for (let i = 0; i < this.players.length; i++) {
                // players[i].anims.play(animations[i])
                if (!paused) {
                    this.players[i].phaserObject.anims.play(animations[i]);
                    // this.startRunningAnimation(players[i], i);
                }
            }
            pauseButton?.setText('Pause');
            paused = false;
        } else {
            pauseButton?.setText('Resume');

            for (let i = 0; i < this.players.length; i++) {
                // this.stopRunningAnimation(players[i], i);
                this.players[i].phaserObject.anims.pause();
            }

            paused = true;
        }
    }

    // setGoal(playerIndex: number) {
    //     const goal = this.physics.add.sprite(this.trackLength, this.getYPosition(playerIndex), 'goal');
    //     goal.setScale(0.1, 0.1);
    //     goals.push(goal);
    // }

    getYPosition(playerIndex: number) {
        switch (playerIndex) {
            case 0:
                return this.posY;
            case 1:
                return this.posY + this.plusY;
            case 2:
                return this.posY + this.plusY * 2;
            case 3:
                return this.posY + this.plusY * 3;
            default:
                return 0;
        }
    }

    mapServerXToWindowX(positionX: number) {
        return (positionX * (window.innerWidth - 200)) / (this.trackLength || 1);
    }

    setObstacles(
        playerIndex: number,
        obstacleArray: Array<ObstacleDetails>
    ): Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> {
        const yPosition = this.getYPosition(playerIndex);
        // this.players[playerIndex].playerObstacles = [];
        let obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        const obstacles: Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody> = [];
        for (let i = 0; i < obstacleArray.length; i++) {
            // const posX = (obstacleArray[i].positionX * (window.innerWidth - 200)) / (trackLength || 1);
            const posX = this.mapServerXToWindowX(obstacleArray[i].positionX) + 75;
            switch (obstacleArray[i].type) {
                case 'TreeStump':
                    obstacle = this.placeObstacle(posX, yPosition + 45, obstacleArray[i].type);
                    obstacle.setScale(0.4, 0.4);
                    break;
                case 'Spider':
                    obstacle = this.placeObstacle(posX, yPosition + 25, obstacleArray[i].type);
                    obstacle.setScale(0.2, 0.2);
                    break;
                default:
                    obstacle = this.placeObstacle(posX, yPosition + 30, obstacleArray[i].type);
                    obstacle.setScale(0.3, 0.3);
            }

            obstacle.setDepth(obstacleArray.length - i);

            //this.players[playerIndex].playerObstacles.push(obstacle);
            obstacles.push(obstacle);
        }
        return obstacles;
    }

    placeObstacle(x: number, y: number, type: string) {
        // eslint-disable-next-line no-console
        // console.log(`x: ${x}y: ${y}${type}`);
        let textureName = 'TreeStump';
        switch (type) {
            case 'Spider':
                textureName = 'spider';
                break;
            case 'Wood':
                textureName = 'wood';
                break;
            default:
                textureName = 'wood';
        }
        return this.physics.add.sprite(x, y, textureName); //.setDepth(1);
    }

    handleError(msg = 'Something went wrong.') {
        this.add.text(32, 32, `Error: ${msg}`, { font: '30px Arial' });
        this.players.forEach(player => {
            player.phaserObject.destroy();
        });

        this.players.forEach(player => {
            player.playerObstacles.forEach(obstacle => {
                obstacle.destroy();
            });
        });

        this.backgroundMusicLoop?.stop();

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
        // eslint-disable-next-line no-console
        // console.log('game over');
        this.backgroundMusicLoop?.stop();
        // this.sound.add('backgroundMusicEnd', { volume: 0.2 });
        // eslint-disable-next-line no-console
        // console.log(this.backgroundMusicLoop);
        history.push(`/screen/${roomId}/finished`);
        // }
    }

    checkAtObstacle(playerIndex: number, isAtObstacle: boolean, playerPositionX: number) {
        if (isAtObstacle && !this.players[playerIndex].playerAtObstacle) {
            this.stopRunningAnimation(this.players[playerIndex].phaserObject, playerIndex);
            this.players[playerIndex].playerAtObstacle = true;

            this.addAttentionIcon(playerIndex);
        } else if (!isAtObstacle && this.players[playerIndex].playerAtObstacle && !paused) {
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

        // this.playerObstacles.forEach(pObstacles => {
        //     pObstacles.forEach(element => {
        //         if (element.x === playerPositionX && element.y === this.getYPosition(playerIndex)) {
        //             element.destroy();
        //         }
        //     });
        // });
    }

    update() {
        socket.on('message', (data: SocketMessage) => this.handleMessage(data));
        for (let i = 0; i < this.players.length; i++) {
            if (!moveplayers[i]) {
                // players[i].anims.stop();
                this.stopRunningAnimation(this.players[i].phaserObject, i);
            }
        }
    }

    startRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.play(animations[playerIdx]);
        this.players[playerIdx].playerRunning = true;
        // eslint-disable-next-line no-console
        // console.log('run forward');
    }
    stopRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.stop();
        this.players[playerIdx].playerRunning = false;
    }

    moveForward(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, toX: number, playerIndex: number) {
        toX = this.mapServerXToWindowX(toX);
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
            // eslint-disable-next-line no-console
            // console.log('Stop running');
            // this.stopRunningAnimation(player, playerIndex);
            // this.playerCountSameDistance[playerIndex] = 0;
        }

        if (!paused) {
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
