import Phaser from 'phaser';

import { designDevelopment, localDevelopment, MessageTypes } from '../../../utils/constants';
import { getRandomInt } from '../../../utils/getRandomInt';
import { screenFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import { MessageSocket } from '../../socket/MessageSocket';
import { Socket } from '../../socket/Socket';
import {
    AllScreensPhaserGameLoadedMessage,
    allScreensPhaserGameLoadedTypeGuard,
} from '../../typeGuards/allScreensPhaserGameLoaded';
import { finishedTypeGuard, GameHasFinishedMessage } from '../../typeGuards/finished';
import { GameStateInfoMessage, gameStateInfoTypeGuard } from '../../typeGuards/gameStateInfo';
import { InitialGameStateInfoMessage, initialGameStateInfoTypeGuard } from '../../typeGuards/initialGameStateInfo';
import { GameHasPausedMessage, pausedTypeGuard } from '../../typeGuards/paused';
import { GameHasResumedMessage, resumedTypeGuard } from '../../typeGuards/resumed';
import { GameHasStartedMessage, startedTypeGuard } from '../../typeGuards/started';
import { GameHasStoppedMessage, stoppedTypeGuard } from '../../typeGuards/stopped';
import { GameAudio } from '../phaser/GameAudio';
import GameEventEmitter from '../phaser/GameEventEmitter';
import { GameEventTypes } from '../phaser/GameEventTypes';
import { GameData } from '../phaser/gameInterfaces';
import { gameLoadingMessages } from '../phaser/gameLoadingMessages';
import { GameToScreenMapper } from '../phaser/GameToScreenMapper';
import { initialGameInput } from '../phaser/initialGameInput';
import { Player } from '../phaser/Player';
import printMethod from '../phaser/printMethod';
import { PhaserGameRenderer } from '../phaser/renderer/PhaserGameRenderer';
import { audioFiles, characters, fireworkFlares, images } from './GameAssets';

const windowWidth = window.innerWidth;
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

        if (this.roomId === '' && data.roomId !== undefined) {
            this.roomId = data.roomId;
        }
    }

    preload(): void {
        //progress bar: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13#Loading_Our_Assets
        //TODO change any
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        //loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0xa7bdb1);
        progressBox.setDepth(3);
        // progressBox.fillRect(260, 270, 320, 50);
        const progressBoxWidth = 320;
        const progressBoxHeight = 50;
        const screenCenterWidth = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterHeight = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const progressBoxXPos = width / 2 - progressBoxWidth / 2;
        const progressBoxYPos = height / 2 - progressBoxHeight / 2;
        progressBox.fillRect(progressBoxXPos, progressBoxYPos, progressBoxWidth, progressBoxHeight);

        //loading text
        // printMethod('**');
        // printMethod(height);
        // printMethod(windowHeight);
        // printMethod('**');

        const loadingText = this.make.text({
            x: screenCenterWidth,
            y: screenCenterHeight - progressBoxHeight,
            text: `${gameLoadingMessages[getRandomInt(0, gameLoadingMessages.length)]}...`,
            // text: 'Loading...',
            style: {
                fontSize: `${20}px`,
                fontFamily: 'Roboto, Arial',
                // font: '20px monospace',
                // fixedWidth: progressBoxWidth,
                // fixedHeight: progressBoxHeight,
                align: 'center',
                // boundsAlignV: 'middle',
                // fill: '#ffffff',
            },
        });
        loadingText.setOrigin(0.5);

        //loading percentage
        const percentText = this.make.text({
            x: screenCenterWidth,
            y: screenCenterHeight,
            text: '0%',
            style: {
                fontSize: `${18}px`,
                fontFamily: 'Roboto, Arial',
                color: '#0d1a17',
                // fixedWidth: progressBoxWidth,
                // fixedHeight: progressBoxHeight,
                align: 'center',
                fontStyle: 'bold',

                // verticalAlign:''
                // fill: '#ffffff'
            },
        });
        // percentText.setTextBounds(0, 0, progressBoxWidth, progressBoxHeight)
        percentText.setOrigin(0.5);
        percentText.setDepth(10);

        // //asset text
        // const assetText = this.make.text({
        //     x: width / 2,
        //     y: height / 2 + 50,
        //     text: '',
        //     style: {
        //         font: '18px monospace',
        //         // fill: '#ffffff'
        //     },
        // });
        // assetText.setOrigin(0.5, 0.5);

        // emitted every time a file has been loaded
        this.load.on('progress', function (value: number) {
            printMethod(value);
            percentText.setText(`${Math.round(value * 100)}%`);

            progressBar.clear();
            progressBar.fillStyle(0xd2a44f, 1);
            progressBar.fillRect(
                width / 2 - progressBoxWidth / 2 + 10,
                height / 2 - progressBoxHeight / 2 + 10,
                300 * value,
                30
            );
            progressBar.setDepth(5);
        });
        // emitted every time a file has been loaded
        // this.load.on('fileprogress', function (file: any) {
        //     printMethod(file.src);
        //     // assetText.setText(`Loading asset: ${file.src}`);
        // });

        //once all the files are done loading

        this.load.on('complete', () => {
            loadingText.destroy();
            percentText.destroy();
            progressBox.destroy();
            progressBar.destroy();
            // assetText.destroy();

            printMethod('LOADING COMPLETE - SENDING TO SERVER');
            this.socket?.emit({
                type: MessageTypes.phaserLoaded,
                roomId: this.roomId,
            });
        });

        //---------
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

        //TODO Loading bar: https://www.patchesoft.com/phaser-3-loading-screen
        // this.load.on('progress', this.updateBar);
    }

    create() {
        this.gameRenderer = new PhaserGameRenderer(this);
        // // this.gameRenderer?.renderBackground(windowWidth, windowHeight, this.trackLength);
        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();
        this.initSockets();
        this.initiateEventEmitters();

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
            type: MessageTypes.createGame,
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
