import Phaser from 'phaser';
import { stringify } from 'querystring';

// import game1SoundEnd from '../../assets/audio/Game_1_Sound_End.wav';
import game1SoundLoop from '../../assets/audio/Game_1_Sound_Loop.wav';
import game1SoundStart from '../../assets/audio/Game_1_Sound_Start.wav';
import forest from '../../images/background.png';
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

const players: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
const goals: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
const obstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
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

    constructor() {
        super('MainScene');
        this.posX = 50;
        this.plusX = 40;
        this.posY = 350;
        this.plusY = 110;
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
        // this.load.audio('backgroundMusicEnd', [game1SoundEnd]);
        //require('../../audio/Sound_Game.mp3')

        this.load.spritesheet('franz', franz, { frameWidth: 826, frameHeight: 1163 });
        this.load.spritesheet('susi', susi, { frameWidth: 826, frameHeight: 1163 });
        this.load.spritesheet('noah', noah, { frameWidth: 826, frameHeight: 1163 });
        this.load.spritesheet('steffi', steffi, { frameWidth: 826, frameHeight: 1163 });

        this.load.image('forest', forest);
        // this.load.image('track', track);
        // this.load.image('startLine', startLine);
        // this.load.image('finishLine', finishLine);
        this.load.image('goal', goal);
        this.load.image('wood', wood);
        this.load.image('spider', spider);
    }

    create() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const bg = this.add.image(windowWidth / 2, windowHeight / 2, 'forest');
        bg.setDisplaySize(windowWidth, windowHeight);

        // this.add.image(0, 10, 'track');

        const backgroundMusicStart = this.sound.add('backgroundMusicStart');
        const backgroundMusicLoop = this.sound.add('backgroundMusicLoop');

        // for end: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/audio/
        // const backgroundMusicEnd = this.sound.add('backgroundMusicEnd');

        backgroundMusicStart.play({ loop: false });
        backgroundMusicStart.once('complete', () => {
            backgroundMusicLoop.play({ loop: true });
        });

        players.push(this.physics.add.sprite(this.posX, this.posY, 'franz'));
        players.push(this.physics.add.sprite(this.posX + this.plusX, this.posY + this.plusY, 'susi'));
        players.push(this.physics.add.sprite(this.posX + this.plusX * 2, this.posY + this.plusY * 2, 'noah'));
        players.push(this.physics.add.sprite(this.posX + this.plusX * 3, this.posY + this.plusY * 3, 'steffi'));

        players.forEach(player => {
            player.setBounce(0.2);
            player.setCollideWorldBounds(true);
            player.setScale(0.15, 0.15);
            player.setCollideWorldBounds(true);
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
                            players[i].anims.play(animations[i]);
                            if (obstacles.length < data.data.playersState[0].obstacles.length * playerNumber)
                                this.setObstacles(i, data.data.playersState[i].obstacles);
                            this.setGoal(i);
                        }
                    }
                }

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

    setObstacles(playerIndex: number, obstacleArray: [{ id: number; positionX: number; type: string }]) {
        const yPosition = this.getYPosition(playerIndex);
        let obstacle: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        for (let i = 0; i < obstacleArray.length; i++) {
            const posX = (obstacleArray[i].positionX * (window.innerWidth - 200)) / (trackLength || 1);
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

            obstacles.push(obstacle);
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
        return this.physics.add.sprite(x, y, textureName);
    }

    handleError(msg: string) {
        this.add.text(32, 32, `Error: ${msg}`, { font: '30px Arial' });
        players.forEach(player => {
            player.destroy();
        });

        obstacles.forEach(obstacle => {
            obstacle.destroy();
        });

        obstacles.forEach(obstacle => {
            obstacle.destroy();
        });
    }

    removePlayerSprite(index: number) {
        players[index].destroy();
    }

    updateGameState(playerData: any) {
        for (let i = 0; i < playerNumber; i++) {
            if (players[i] !== undefined && playerData !== undefined) {
                this.moveForward(players[i], playerData[i].positionX);
                this.checkAtObstacle(i, playerData[i].atObstacle, playerData[i].positionX);
                this.checkFinished(i, playerData[i].finished);
            }
        }
    }

    checkFinished(playerIndex: number, isFinished: boolean) {
        if (isFinished) {
            players[playerIndex].anims.stop();
        }
    }

    checkAtObstacle(playerIndex: number, isAtObstacle: boolean, playerPositionX: number) {
        if (isAtObstacle && players[playerIndex].anims.isPlaying) {
            players[playerIndex].anims.stop();
        } else if (!isAtObstacle && !players[playerIndex].anims.isPlaying) {
            players[playerIndex].anims.play(animations[playerIndex]);
            this.destroyObstacle(playerIndex, playerPositionX);
        }
    }

    destroyObstacle(playerIndex: number, playerPositionX: number) {
        obstacles.forEach(element => {
            if (element.x === playerPositionX && element.y === this.getYPosition(playerIndex)) {
                element.destroy();
            }
        });
    }

    update() {
        socket.on('message', (data: any) => this.handleMessage(data));
        for (let i = 0; i < players.length; i++) {
            if (!moveplayers[i]) {
                players[i].anims.stop();
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

    moveForward(player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, toX: number) {
        player.x = toX;
    }
}

export default MainScene;
