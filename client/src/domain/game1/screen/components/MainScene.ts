/* eslint-disable no-console */
import Phaser from 'phaser';

import chasersSpritesheet from '../../../../images/characters/spritesheets/chasers/chasers_spritesheet.png';
import windSpritesheet from '../../../../images/characters/spritesheets/chasers/wind_spritesheet.png';
import { designDevelopment, localDevelopment, MessageTypes, MessageTypesGame1 } from '../../../../utils/constants';
import { GameToScreenMapper } from '../../../phaser/game1/GameToScreenMapper';
import { initialGameInput } from '../../../phaser/game1/initialGameInput';
import { Player } from '../../../phaser/game1/Player';
import { PhaserPlayerRenderer } from '../../../phaser/game1/renderer/PhaserPlayerRenderer';
import { GameAudio } from '../../../phaser/GameAudio';
import GameEventEmitter from '../../../phaser/GameEventEmitter';
import { GameEventTypes } from '../../../phaser/GameEventTypes';
import { GameData } from '../../../phaser/gameInterfaces';
import { PhaserGame } from '../../../phaser/PhaserGame';
import { PhaserGameRenderer } from '../../../phaser/renderer/PhaserGameRenderer';
import { Socket } from '../../../socket/Socket';
import { initSockets } from '../gameState/initSockets';
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
    players: Player[];
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
    socketsInitiated = false;

    constructor() {
        super(PhaserGame.SCENE_NAME_GAME_1);
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
        // this.setAllVars() //TODO use to remove duplicate code

        this.initiateEventEmitters();
    }

    resetSceneVariables() {
        this.players = [];
        this.gameStarted = false;
        this.paused = false;
        this.firstGameStateReceived = false;
        this.allScreensLoaded = false;
    }

    init(data: { roomId: string; socket: Socket; screenAdmin: boolean }) {
        this.resetSceneVariables();
        this.camera = this.cameras.main;
        this.windowWidth = this.cameras.main.width;
        this.windowHeight = this.cameras.main.height;
        this.posY = this.windowHeight / 2 - 50;
        this.socket = data.socket;
        this.screenAdmin = data.screenAdmin;
        this.gameRenderer = new PhaserGameRenderer(this);

        if (!this.socketsInitiated) this.initSockets();

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

    //called when preload has finished loading all the files
    create() {
        this.gameRenderer?.updateLoadingScreenFinishedPreloading();
        this.socket?.emit({
            type: MessageTypesGame1.phaserLoaded,
            roomId: this.roomId,
        });

        this.gameAudio = new GameAudio(this.sound);
        this.gameAudio.initAudio();

        if (localDevelopment && designDevelopment) {
            this.initiateGame(initialGameInput);
        }
    }

    sendStartGame() {
        handleStartGame(this.socket, this.roomId);
    }

    initSockets() {
        this.socketsInitiated = true;

        initSockets({
            socket: this.socket,
            screenAdmin: this.screenAdmin,
            scene: this,
            roomId: this.roomId,
        });
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
        this.gameRenderer?.destroyLoadingScreen();
        if (!localDevelopment && !designDevelopment) {
            this.gameStarted = true;
        }

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
        this.players.forEach((player, index) => {
            if (gameStateData.playersState[index]?.dead) {
                if (!player.player.isFinished) {
                    player.handlePlayerDead();
                }
            } else if (gameStateData.playersState[index]?.finished) {
                if (!player.player.isFinished) {
                    player.handlePlayerFinished();
                }
            } else if (gameStateData.playersState[index]?.stunned) {
                player.handlePlayerStunned();
            } else {
                if (player.player.isStunned) {
                    player.handlePlayerUnStunned();
                }

                player.moveForward(gameStateData.playersState[index]?.positionX);
                player.checkAtObstacle(gameStateData.playersState[index]?.atObstacle);
            }
            player.setChasers(gameStateData.chasersPositionX);
        });

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

    createGameCountdown(countdownTime: number) {
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
