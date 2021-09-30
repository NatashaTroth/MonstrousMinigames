import User from '../../classes/user';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { RandomWordGenerator } from './classes/RandomWordGenerator';
import InitialParameters from './constants/InitialParameters';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import { GameStateInfo } from './interfaces/GameStateInfo';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    private countdownTimeGameStart = InitialParameters.COUNTDOWN_TIME_GAME_START;
    private photoTopics?: string[];
    private countdownTimeTakePhoto = InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO;
    private countdownTimeVote = InitialParameters.COUNTDOWN_TIME_VOTE;
    private randomWordGenerator = new RandomWordGenerator();
    private numberPhotoTopics = InitialParameters.NUMBER_PHOTO_TOPICS;
    private photoTimeSeconds = 0;
    private takingPhoto = false;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);

        console.log('game3 created');
        console.info(this);
    }

    getGameStateInfo(): GameStateInfo {
        //TODO do i need to send this? think not
        return {
            gameState: this.gameState,
            roomId: this.roomId,
        };
    }

    protected beforeCreateNewGame() {
        return;
    }

    protected mapUserToPlayer(user: User): GameThreePlayer {
        const player = new GameThreePlayer(user.id, user.name);
        console.info(player);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // handle taking photo
        if (this.takingPhoto) this.handleTakingPhoto(timeElapsedSinceLastFrame);
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        console.error('Unimplemented Method');
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.photoTopics = this.randomWordGenerator.generateRandomWords(this.numberPhotoTopics);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTimeGameStart);
        GameThreeEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTimeGameStart);
        this.sendPhotoTopic();
    }

    sendPhotoTopic() {
        //TODO verify game state
        const topic = this.photoTopics?.shift();
        if (topic) {
            this.photoTimeSeconds = this.countdownTimeTakePhoto;
            this.takingPhoto = true;
            //send to screen
            GameThreeEventEmitter.emitNewTopic(this.roomId, topic, this.countdownTimeTakePhoto);
        } else {
            //TODO finished sending topics - now final round
        }
    }

    pauseGame(): void {
        super.pauseGame();
        GameThreeEventEmitter.emitGameHasPausedEvent(this.roomId);
    }

    resumeGame(): void {
        super.resumeGame();
        GameThreeEventEmitter.emitGameHasResumedEvent(this.roomId);
    }

    stopGameUserClosed() {
        super.stopGameUserClosed();
        GameThreeEventEmitter.emitGameHasStoppedEvent(this.roomId);
    }

    stopGameAllUsersDisconnected() {
        super.stopGameAllUsersDisconnected();
    }

    protected handleInput(message: IMessage) {
        switch (message.type) {
            // case GameThreeMessageTypes.MOVE:
            //     this.movePlayer(message.userId!, message.direction!);
            //     break;
            // case GameThreeMessageTypes.KILL:
            //     this.killSheep(message.userId!);
            //     break;
            default:
                console.info(message);
        }
    }

    //********************** Helper Functions **********************/
    protected handleTakingPhoto(timeElapsedSinceLastFrame: number) {
        this.photoTimeSeconds -= timeElapsedSinceLastFrame;
        if (this.photoTimeSeconds <= 0) {
            this.takingPhoto = false;
            GameThreeEventEmitter.emitTakePhotoCountdownOver(this.roomId);
        }
    }
}
