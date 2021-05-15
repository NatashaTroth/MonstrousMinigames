import Phaser from 'phaser';
import { stringify } from 'querystring';

import game1SoundEnd from '../../assets/audio/Game_1_Sound_End.wav';
import game1SoundLoop from '../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../assets/audio/Game_1_Sound_Start.wav';
import history from '../../domain/history/history';
import attention from '../../images/attention.png';
import forest from '../../images/backgroundGame.png';
// import finishLine from '../../images/finishLine.png';
import franz from '../../images/franz_spritesheet.png';
import goal from '../../images/goal.png';
import noah from '../../images/noah_spritesheet.png';
import spider from '../../images/spider.png';
// import startLine from '../../images/startLine.png';
import steffi from '../../images/steffi_spritesheet.png';
import susi from '../../images/susi_spritesheet.png';
// import track from '../../images/track.png';
import wood from '../../images/wood.png';
import { MessageTypes } from '../../utils/constants';

const players: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
// const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
let playerNumber = 0;
let roomId = '';
const moveplayers = [true, true, true, true];
//let obstaclesCleared = [0,0,0,0]
let socket: SocketIOClient.Socket;
let trackLength = 0;
const animations = ['franzWalk', 'susiWalk', 'noahWalk', 'steffiWalk'];

let logged = false;

class MainScene extends Phaser.Scene {
    posX: number;
    plusX: number;
    posY: number;
    plusY: number;
    playerRunning: Array<boolean>;
    playerAtObstacle: Array<boolean>;
    playerObstacles: Array<Array<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>>;
    playerText: Array<Phaser.GameObjects.Text>;
    playerCountSameDistance: Array<number>;
    playerAttention: Array<null | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>;
    test: number;
    numberPlayersFinished: number;
    backgroundMusicLoop: undefined | Phaser.Sound.BaseSound;

    constructor() {
        super('MainScene');
        this.posX = 50;
        this.plusX = 40;
        this.posY = window.innerHeight / 2 - 50;
        this.plusY = 110;
        this.playerRunning = [];
        this.playerAtObstacle = [];
        this.playerAttention = [];
        this.playerObstacles = [];
        this.playerCountSameDistance = [];
        this.playerText = [];
        this.test = 0;
        this.numberPlayersFinished = 0;
        this.backgroundMusicLoop = undefined;
    }

    init(data: { roomId: string; playerNumber: number }) {
        if (roomId === '' && data.roomId !== undefined) {
            roomId = data.roomId;
        }
        socket = this.handleSocketConnection();
    }

    preload(): void {
        // this.load.audio('music', ['../../assets/audio/Sound_Game.mp3']);
        // require('../../audio/Sound_Game.mp3');
        this.load.audio('backgroundMusicStart', [game1SoundStart]);
        this.load.audio('backgroundMusicLoop', [game1SoundLoop]);
        this.load.audio('backgroundMusicEnd', [game1SoundEnd]);
        //require('../../audio/Sound_Game.mp3')

        this.load.spritesheet('franz', franz, {
            frameWidth: 826,
            frameHeight: 1163,
        });
        this.load.spritesheet('susi', susi, { frameWidth: 826, frameHeight: 1163 });
        this.load.spritesheet('noah', noah, { frameWidth: 826, frameHeight: 1163 });
        this.load.spritesheet('steffi', steffi, {
            frameWidth: 826,
            frameHeight: 1163,
        });

        this.load.image('forest', forest);
        // this.load.image('track', track);
        // this.load.image('startLine', startLine);
        // this.load.image('finishLine', finishLine);
        this.load.image('attention', attention);
        this.load.image('goal', goal);
        this.load.image('wood', wood);
        this.load.image('spider', spider);
    }

    create() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const bg = this.add.image(windowWidth / 2, windowHeight / 2, 'forest');
        bg.setDisplaySize(windowWidth, windowHeight);

        const backgroundMusicStart = this.sound.add('backgroundMusicStart', { volume: 0.2 });
        this.backgroundMusicLoop = this.sound.add('backgroundMusicLoop', { volume: 0.2 });

        // for end: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/audio/
        // const backgroundMusicEnd = this.sound.add('backgroundMusicEnd');

        backgroundMusicStart.play({ loop: false });
        backgroundMusicStart.once('complete', () => {
            this.backgroundMusicLoop?.play({ loop: true });
        });

        players.push(this.physics.add.sprite(this.posX, this.posY, 'franz').setDepth(50));

        players.push(this.physics.add.sprite(this.posX + this.plusX, this.posY + this.plusY, 'susi').setDepth(50));
        players.push(
            this.physics.add.sprite(this.posX + this.plusX * 2, this.posY + this.plusY * 2, 'noah').setDepth(50)
        );
        players.push(
            this.physics.add.sprite(this.posX + this.plusX * 3, this.posY + this.plusY * 3, 'steffi').setDepth(50)
        );

        players.forEach(player => {
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            player.setScale(0.15, 0.15);
            player.setCollideWorldBounds(true);
            this.playerRunning.push(false);
            this.playerAtObstacle.push(false);
            this.playerObstacles.push([]);
            this.playerCountSameDistance.push(0);
            this.playerAttention.push(null);
        });

        this.anims.create({
            key: 'franzWalk',
            frames: this.anims.generateFrameNumbers('franz', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: 'susiWalk',
            frames: this.anims.generateFrameNumbers('susi', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: 'noahWalk',
            frames: this.anims.generateFrameNumbers('noah', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: 'steffiWalk',
            frames: this.anims.generateFrameNumbers('steffi', { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1,
        });
    }

    handleMessage(data: any) {
        if (data.type == 'error') {
            this.handleError(data.msg);
        } else {
            if (trackLength === 0 && data.data !== undefined) {
                trackLength = data.data.trackLength;
            }
            if (!roomId) {
                roomId = data.data.roomId;
            }
            if (data.type === MessageTypes.gameHasFinished) {
                this.handleGameOver();
            }
            if (data.type === MessageTypes.gameHasStopped || data.type === MessageTypes.gameHasTimedOut) {
                this.backgroundMusicLoop?.stop();
            }
            if (data.type === 'game1/gameState') {
                if (logged == false) {
                    // eslint-disable-next-line no-console
                    // console.log(data.data.playersState[0]);
                    logged = true;
                    if (playerNumber == 0) {
                        playerNumber = data.data.playersState.length;

                        if (playerNumber < 4) {
                            for (let i = playerNumber; i < 4; i++) {
                                players[i].destroy();
                            }
                        }
                        for (let i = 0; i < playerNumber; i++) {
                            this.playerText[i] = this.add
                                .text(
                                    players[i].x, //+ 50
                                    players[i].y - 100,
                                    data.data.playersState[i].name,
                                    { font: '16px Arial', align: 'center', fixedWidth: 150 }
                                )
                                .setDepth(50);
                            // this.playerText[i].setFixedSize = players[i].width;
                            this.playerText[i].setBackgroundColor('#000000');
                            // players[i].anims.play(animations[i]);
                            // if (obstacles.length < data.data.playersState[0].obstacles.length * playerNumber)
                            this.setObstacles(i, data.data.playersState[i].obstacles);
                            this.setGoal(i);
                        }
                    }
                }

                // setInterval(() => {
                //     // eslint-disable-next-line no-console
                //     console.log(data.data.gameState);
                // }, 5000);
                // if (data.data.gameState == MessageTypes.gameHasFinished) {
                //     this.handleGameOver();
                // }

                this.updateGameState(data.data.playersState);
            }
        }
    }

    setGoal(playerIndex: number) {
        const goal = this.physics.add.sprite(trackLength, this.getYPosition(playerIndex), 'goal');
        goal.setScale(0.1, 0.1);
        goals.push(goal);
    }

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
        return (positionX * (window.innerWidth - 200)) / (trackLength || 1);
    }

    setObstacles(playerIndex: number, obstacleArray: [{ id: number; positionX: number; type: string }]) {
        const yPosition = this.getYPosition(playerIndex);
        this.playerObstacles[playerIndex] = [];
        let obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
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

            this.playerObstacles[playerIndex].push(obstacle);
            // obstacles.push(obstacle);
        }
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

    handleError(msg: string) {
        this.add.text(32, 32, `Error: ${msg}`, { font: '30px Arial' });
        players.forEach(player => {
            player.destroy();
        });

        this.playerObstacles.forEach(pObstacles => {
            pObstacles.forEach(obstacle => {
                obstacle.destroy();
            });
        });

        this.backgroundMusicLoop?.stop();

        // obstacles.forEach(obstacle => {
        //     obstacle.destroy();
        // });
    }

    removePlayerSprite(index: number) {
        players[index].destroy();
    }

    updateGameState(playerData: any) {
        for (let i = 0; i < playerNumber; i++) {
            if (players[i] !== undefined && playerData !== undefined) {
                this.moveForward(players[i], playerData[i].positionX, i);
                this.checkAtObstacle(i, playerData[i].atObstacle, playerData[i].positionX);
                this.checkFinished(i, playerData[i].finished);
            }
        }
    }

    checkFinished(playerIndex: number, isFinished: boolean) {
        if (isFinished) {
            // players[playerIndex].anims.stop();
            this.stopRunningAnimation(players[playerIndex], playerIndex);
            this.numberPlayersFinished++;
        }
    }

    handleGameOver() {
        //end of game
        // if(this.numberPlayersFinished >= players.length){
        // eslint-disable-next-line no-console
        // console.log('game over');
        this.backgroundMusicLoop?.stop();
        this.sound.add('backgroundMusicEnd', { volume: 0.2 });
        // eslint-disable-next-line no-console
        // console.log(this.backgroundMusicLoop);
        history.push(`/screen/${roomId}/finished`);
        // }
    }

    checkAtObstacle(playerIndex: number, isAtObstacle: boolean, playerPositionX: number) {
        if (isAtObstacle && !this.playerAtObstacle[playerIndex]) {
            this.stopRunningAnimation(players[playerIndex], playerIndex);
            this.playerAtObstacle[playerIndex] = true;

            this.addAttentionIcon(playerIndex);
        } else if (!isAtObstacle && this.playerAtObstacle[playerIndex]) {
            this.playerAtObstacle[playerIndex] = false;
            this.startRunningAnimation(players[playerIndex], playerIndex);
            this.destroyObstacle(playerIndex, playerPositionX);
            this.destroyAttentionIcon(playerIndex);
        }
    }

    addAttentionIcon(playerIndex: number) {
        if (!this.playerAttention[playerIndex]) {
            this.playerAttention[playerIndex] = this.physics.add
                .sprite(players[playerIndex].x + 75, players[playerIndex].y - 150, 'attention')
                .setDepth(100)
                .setScale(0.03, 0.03);
        }
    }

    destroyAttentionIcon(playerIndex: number) {
        this.playerAttention[playerIndex]?.destroy();
        this.playerAttention[playerIndex] = null;
    }

    destroyObstacle(playerIndex: number, playerPositionX: number) {
        if (this.playerObstacles[playerIndex].length > 0) {
            this.playerObstacles[playerIndex][0].destroy();
            this.playerObstacles[playerIndex].shift();
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
        socket.on('message', (data: any) => this.handleMessage(data));
        for (let i = 0; i < players.length; i++) {
            if (!moveplayers[i]) {
                // players[i].anims.stop();
                this.stopRunningAnimation(players[i], i);
            }
        }
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

    startRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.play(animations[playerIdx]);
        this.playerRunning[playerIdx] = true;
        // eslint-disable-next-line no-console
        // console.log('run forward');
    }
    stopRunningAnimation(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, playerIdx: number) {
        player.anims.stop();
        this.playerRunning[playerIdx] = false;
        // eslint-disable-next-line no-console
        // console.log('stpop run forward');
    }

    moveForward(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, toX: number, playerIndex: number) {
        // eslint-disable-next-line no-console
        toX = this.mapServerXToWindowX(toX);
        if (toX == player.x) {
            this.playerCountSameDistance[playerIndex]++; // if idle for more than a second - means actually stopped, otherwise could just be waiting for new
        } else {
            this.playerCountSameDistance[playerIndex] = 0;
            // eslint-disable-next-line no-console
            // console.log('not same');
            // eslint-disable-next-line no-console
            if (!this.playerRunning[playerIndex]) {
                // eslint-disable-next-line no-console
                // console.log('start moving runnnnnn');
                // console.log('start moving runnnnnn new x: ', toX);
                // eslint-disable-next-line no-console
                // console.log('current x: ', player.x);

                this.startRunningAnimation(player, playerIndex);
            }
        }

        if (this.playerRunning[playerIndex] && this.playerCountSameDistance[playerIndex] > 100) {
            //TODO HANDLE
            // eslint-disable-next-line no-console
            // console.log('Stop running');
            // this.stopRunningAnimation(player, playerIndex);
            // this.playerCountSameDistance[playerIndex] = 0;
        }

        player.x = toX;
        this.playerText[playerIndex].x = toX; //- 100;
        this.test++;

        // if (this.test == 100) {
        //     this.test = 0;
        //     // eslint-disable-next-line no-console
        //     console.log(`${player.x}   ${this.playerText[playerIndex].x}`);
        // }
    }
}

export default MainScene;
