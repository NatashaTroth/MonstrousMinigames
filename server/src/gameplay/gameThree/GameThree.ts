import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { RandomWordGenerator } from './classes/RandomWordGenerator';
import InitialParameters from './constants/InitialParameters';
import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import {
    IMessagePhoto,
    IMessagePhotoVote,
    photoPhotographerMapper,
    votingResultsPhotographerMapper,
} from './interfaces';
import { GameStateInfo } from './interfaces/GameStateInfo';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    private countdownTimeGameStart = InitialParameters.COUNTDOWN_TIME_GAME_START;
    private photoTopics?: string[];
    private countdownTimeTakePhoto = InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO;
    private countdownTimeVote = InitialParameters.COUNTDOWN_TIME_VOTE;
    private randomWordGenerator = new RandomWordGenerator();
    private numberPhotoTopics = InitialParameters.NUMBER_PHOTO_TOPICS;
    private countdownTimeElapsed = 0;
    private takingPhoto = false; //TODO change to state
    private voting = false;
    private roundIdx = 0;
    gameName = GameNames.GAME3;

    constructor(roomId: string, public leaderboard: Leaderboard) {
        super(roomId);
        this.sendGameStateUpdates = false;

        // console.log('game3 created');
        // console.info(this);
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
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // handle taking photo
        if (this.takingPhoto) this.handleTakingPhoto(timeElapsedSinceLastFrame);
        if (this.voting) this.handleVoting(timeElapsedSinceLastFrame);
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        //TODO
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.photoTopics = this.randomWordGenerator.generateRandomWords(this.numberPhotoTopics);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
        }, this.countdownTimeGameStart);
        GameThreeEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTimeGameStart, this.gameName);
        this.sendPhotoTopic();
    }

    sendPhotoTopic() {
        //TODO verify game state
        //TODO reset player has photo
        const topic = this.photoTopics?.shift();
        if (topic) {
            this.countdownTimeElapsed = this.countdownTimeTakePhoto;
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
            case GameThreeMessageTypes.PHOTO: {
                this.handleReceivedPhoto(message as IMessagePhoto);
                break;
            }
            case GameThreeMessageTypes.PHOTO_VOTE: {
                //TODO handle countdown over..
                this.handleReceivedPhotoVote(message as IMessagePhotoVote);
                break;
            }
            // case GameThreeMessageTypes.KILL:
            //     this.killSheep(message.userId!);
            //     break;
            default:
                console.info(message);
        }
    }

    //********************** Helper Functions **********************/

    // *** Taking Photos ***
    private handleTakingPhoto(timeElapsedSinceLastFrame: number) {
        this.countdownTimeElapsed -= timeElapsedSinceLastFrame;
        if (this.countdownTimeElapsed <= 0) {
            this.takingPhoto = false;
            GameThreeEventEmitter.emitTakePhotoCountdownOver(this.roomId);
        }

        //TODO if time over or if all received - check what photos received and forward to screens
    }

    private handleReceivedPhoto(message: IMessagePhoto) {
        const player = this.players.get(message.userId!);
        if (player && !player.roundInfo[this.roundIdx].received) player.receivedPhoto(message.url, this.roundIdx);

        if (this.allPhotosReceived()) {
            this.handleAllPhotosReceived();
            //Do something
        }
    }

    private handleReceivedPhotoVote(message: IMessagePhotoVote) {
        const player = this.players.get(message.photographerId!);
        const voter = this.players.get(message.voterId);
        if (player && voter && !voter.roundInfo[this.roundIdx].voted) {
            player?.addPoints(this.roundIdx, 1);
            if (voter) voter.roundInfo[this.roundIdx].voted = true;
        }
        // this.players.get(message.voterId)?.roundInfo[this.roundIdx].voted = true

        if (this.allVotesReceived()) {
            this.handleAllVotesReceived();
            //Do something
        }
    }

    private allPhotosReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.roundInfo[this.roundIdx].received);
    }

    private handleAllPhotosReceived() {
        //TODO
        // send all photos, start voting
        this.countdownTimeElapsed = 0;
        this.takingPhoto = false;
        this.sendPhotosToScreen();
    }

    private sendPhotosToScreen() {
        const photoUrls: photoPhotographerMapper[] = Array.from(this.players.values()).map(player => {
            return { photographerId: player.id, url: player.roundInfo[this.roundIdx].url };
        });
        this.countdownTimeElapsed = this.countdownTimeVote;
        this.voting = true;
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, this.countdownTimeVote);
    }

    // *** Voting ***

    private handleVoting(timeElapsedSinceLastFrame: number) {
        this.countdownTimeElapsed -= timeElapsedSinceLastFrame;
        if (this.countdownTimeElapsed <= 0) {
            this.voting = false;
            //TODO new round??
            this.sendPhotoVotingResultsToScreen();
        }

        //TODO if time over or if all received - check what photos received and forward to screens
    }

    private allVotesReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.roundInfo[this.roundIdx].voted);
    }

    private handleAllVotesReceived() {
        //TODO
        // send all photos, start voting
        this.countdownTimeElapsed = 0;
        this.voting = false; //TODO state instead
        this.sendPhotoVotingResultsToScreen();
    }

    private sendPhotoVotingResultsToScreen() {
        const votingResults: votingResultsPhotographerMapper[] = Array.from(this.players.values()).map(player => {
            return { photographerId: player.id, points: player.roundInfo[this.roundIdx].points };
        });

        GameThreeEventEmitter.emitPhotoVotingResults(this.roomId, votingResults);
    }
}
