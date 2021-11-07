import User from '../../classes/user';
import { GameNames } from '../../enums/gameNames';
import { IMessage } from '../../interfaces/messages';
import Game from '../Game';
import { IGameInterface } from '../interfaces';
import Leaderboard from '../leaderboard/Leaderboard';
import Player from '../Player';
import { RandomWordGenerator } from './classes/RandomWordGenerator';
import InitialParameters from './constants/InitialParameters';
import { GameThreeGameState } from './enums/GameState';
import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreeEventEmitter from './GameThreeEventEmitter';
// import { GameThreeMessageTypes } from './enums/GameThreeMessageTypes';
import GameThreePlayer from './GameThreePlayer';
import {
    IMessagePhoto, IMessagePhotoVote, photoPhotographerMapper, votingResultsPhotographerMapper
} from './interfaces';
import { GameStateInfo } from './interfaces/GameStateInfo';

type GameThreeGameInterface = IGameInterface<GameThreePlayer, GameStateInfo>;

export default class GameThree extends Game<GameThreePlayer, GameStateInfo> implements GameThreeGameInterface {
    private countdownTimeGameStart = InitialParameters.COUNTDOWN_TIME_GAME_START;
    private photoTopics?: string[];
    private countdownTimeTakePhoto = InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO;
    private countdownTimeVote = InitialParameters.COUNTDOWN_TIME_VOTE;
    private countdownTimeViewResults = InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS;
    private countdownTimeTakeFinalPhotos = InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS;
    private randomWordGenerator = new RandomWordGenerator();
    private numberRounds = InitialParameters.NUMBER_ROUNDS;
    private gameThreeGameState = GameThreeGameState.BeforeStart;
    private countdownTimeLeft = 0;
    private countdownRunning = false;
    private roundIdx = 0;

    // private viewingPhotoResults = false //TODO handle
    // private finalRound = false; //TODO
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
        const player = new GameThreePlayer(user.id, user.name, user.characterNumber);
        return player;
    }
    protected update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // handle taking photo
        if (this.countdownRunning) {
            this.reduceCountdown(timeElapsedSinceLastFrame);
            switch (this.gameThreeGameState) {
                case GameThreeGameState.TakingPhoto:
                    this.handleTakingPhoto();
                    break;
                case GameThreeGameState.Voting:
                    this.handleVoting();
                    break;
                case GameThreeGameState.ViewingResults:
                    this.handleNewRound();
                    break;
            }
        }
    }
    protected postProcessPlayers(playersIterable: IterableIterator<Player>): void {
        //TODO
    }

    createNewGame(users: Array<User>) {
        super.createNewGame(users);
        this.photoTopics = this.randomWordGenerator.generateRandomWords(this.numberRounds - 1);
    }

    startGame(): void {
        setTimeout(() => {
            super.startGame();
            this.sendPhotoTopic();
        }, this.countdownTimeGameStart);
        GameThreeEventEmitter.emitGameHasStartedEvent(this.roomId, this.countdownTimeGameStart, this.gameName);
    }

    private sendPhotoTopic() {
        //TODO verify game state
        //TODO reset player has photo
        const topic = this.photoTopics?.shift();
        if (topic) {
            this.initiateCountdown(this.countdownTimeTakePhoto);
            this.gameThreeGameState = GameThreeGameState.TakingPhoto;
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
            default:
                console.info(message);
        }
    }

    //********************** Helper Functions **********************/

    private initiateCountdown(time: number) {
        this.countdownTimeLeft = time;
        this.countdownRunning = true;
    }

    private reduceCountdown(time: number) {
        this.countdownTimeLeft -= time;
    }

    private stopCountdown() {
        this.countdownTimeLeft = 0;
        this.countdownRunning = false;
    }
    private countdownOver() {
        return this.countdownTimeLeft <= 0;
    }

    // *** Taking Photos ***
    private handleTakingPhoto() {
        if (this.countdownOver()) {
            // GameThreeEventEmitter.emitTakePhotoCountdownOver(this.roomId); //TODO??
            this.sendPhotosToScreen();
        }
    }

    private handleReceivedPhoto(message: IMessagePhoto) {
        const player = this.players.get(message.userId!);
        if (player && !player.roundInfo[this.roundIdx].received) player.receivedPhoto(message.url, this.roundIdx);

        if (this.allPhotosReceived()) {
            this.handleAllPhotosReceived();
            //Do something
        }
    }

    private allPhotosReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.roundInfo[this.roundIdx].received);
    }

    private handleAllPhotosReceived() {
        this.stopCountdown();
        this.sendPhotosToScreen();
    }

    private sendPhotosToScreen() {
        const photoUrls: photoPhotographerMapper[] = Array.from(this.players.values())
            .filter(player => player.roundInfo[this.roundIdx].url)
            .map(player => {
                return { photographerId: player.id, url: player.roundInfo[this.roundIdx].url };
            });

        this.initiateCountdown(this.countdownTimeVote);
        this.gameThreeGameState = GameThreeGameState.Voting;
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, this.countdownTimeVote);
    }

    // *** Voting ***
    private handleReceivedPhotoVote(message: IMessagePhotoVote) {
        const player = this.players.get(message.photographerId!);
        const voter = this.players.get(message.voterId);
        if (player && voter && !voter.roundInfo[this.roundIdx].voted) {
            player?.addPoints(this.roundIdx, 1);
            if (voter) {
                voter.roundInfo[this.roundIdx].voted = true;
                // voter.roundInfo[this.roundIdx].points += 1; //point for voting //TODO???
            }
        }
        // this.players.get(message.voterId)?.roundInfo[this.roundIdx].voted = true

        if (this.allVotesReceived()) {
            this.handleAllVotesReceived();
            //Do something
        }
    }

    private handleVoting() {
        if (this.countdownOver()) {
            this.removeVotingPointsNotVoted();
            this.sendPhotoVotingResultsToScreen();
        }

        //TODO if time over or if all received - check what photos received and forward to screens
    }

    private removeVotingPointsNotVoted() {
        Array.from(this.players.values()).forEach(player => {
            if (!player.roundInfo[this.roundIdx].voted || !player.roundInfo[this.roundIdx].url) {
                player.roundInfo[this.roundIdx].points = 0;
            }
        });
    }

    private allVotesReceived(): boolean {
        return Array.from(this.players.values()).every(player => player.roundInfo[this.roundIdx].voted);
    }

    private handleAllVotesReceived() {
        //TODO
        // send all photos, start voting
        this.stopCountdown();
        this.sendPhotoVotingResultsToScreen();
    }

    private sendPhotoVotingResultsToScreen() {
        const votingResults: votingResultsPhotographerMapper[] = Array.from(this.players.values()).map(player => {
            return { photographerId: player.id, points: player.roundInfo[this.roundIdx].points };
        });
        this.gameThreeGameState = GameThreeGameState.ViewingResults;
        this.initiateCountdown(this.countdownTimeViewResults);

        GameThreeEventEmitter.emitPhotoVotingResults(this.roomId, votingResults, this.countdownTimeViewResults);
    }

    // *** Round Change ***
    private handleNewRound() {
        if (this.countdownOver()) {
            this.roundIdx++;
            if (!this.isFinalRound()) {
                this.sendPhotoTopic();
            } else {
                this.sendTakeFinalPhotosCountdown();
            }
        }
    }

    private isFinalRound() {
        return this.roundIdx >= this.numberRounds - 1;
    }

    // *** Final round ***
    private sendTakeFinalPhotosCountdown() {
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(this.roomId, this.countdownTimeTakeFinalPhotos);
    }
}
