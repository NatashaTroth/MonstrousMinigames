import validator from 'validator';

import InitialParameters from '../constants/InitialParameters';
import { InvalidUrlError } from '../customErrors';
import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { IMessagePhoto, IMessagePhotoVote } from '../interfaces';
import { Countdown } from './Countdown';
import { PhotoStage } from './PhotoStage';
import { VotingStage } from './VotingStage';

//TODO maybe also a round handler class
export class StageController {
    stage = GameThreeGameState.BeforeStart; //TODO make private
    private gameThree: GameThree;
    private _roundIdx = -1;
    numberRounds = InitialParameters.NUMBER_ROUNDS;
    private photoStage?: PhotoStage;
    private votingStage?: VotingStage;
    private countdown: Countdown;

    constructor(gameThree: GameThree) {
        this.gameThree = gameThree;
        this.countdown = new Countdown(this); //TODO remove argument
    }

    updateStage(stage: GameThreeGameState) {
        //TODO remove argument??
        this.stage = stage;

        switch (stage) {
            case GameThreeGameState.TakingPhoto:
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
                this.photoStage = new PhotoStage();
                break;
            case GameThreeGameState.Voting:
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);

                this.votingStage = new VotingStage();
                break;
            case GameThreeGameState.ViewingResults:
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
                //TODO viewing stage?
                break;
        }
    }

    handleNewRound() {
        this._roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.gameThree.roomId, this.roundIdx);
        if (!this.isFinalRound() && this.gameThree.photoTopics!.isAnotherTopicAvailable()) {
            this.gameThree.sendPhotoTopic();
        } else {
            this.gameThree.sendTakeFinalPhotosCountdown();
        }
    }

    handleNextStage() {
        switch (this.stage) {
            case GameThreeGameState.TakingPhoto:
                this.switchToVotingStage();

                break;
            case GameThreeGameState.Voting:
                this.switchToVotingStage();
                break;
            case GameThreeGameState.ViewingResults:
                this.handleNewRound();
                break;
            case GameThreeGameState.TakingFinalPhotos:
                this.gameThree.handleFinishedTakingFinalPhotos();
                break;
            case GameThreeGameState.PresentingFinalPhotos:
                this.gameThree.handlePresentingRoundFinished();
                break;
            case GameThreeGameState.FinalVoting:
                this.gameThree.handleFinishedFinalVoting();
                break;
        }
    }

    public get roundIdx(): number {
        return this._roundIdx;
    }

    private isFinalRound() {
        return this._roundIdx >= this.numberRounds;
    }

    // ********** new ************

    handleReceivedPhoto(message: IMessagePhoto) {
        if (!validator.isURL(message.url))
            throw new InvalidUrlError('The received value for the URL is not valid.', message.userId);

        switch (this.stage) {
            case GameThreeGameState.TakingPhoto:
                this.photoStage!.addPhoto(message.userId, message.url);
                if (this.photoStage!.havePhotosFromAllUsers(Array.from(this.gameThree.players.keys()))) {
                    this.switchToVotingStage();
                }
                break;
            case GameThreeGameState.TakingFinalPhotos:
                this.gameThree.handleReceivedFinalPhoto(message);
                break;
        }
    }

    handleReceivedPhotoVote(message: IMessagePhotoVote) {
        switch (this.stage) {
            case GameThreeGameState.Voting:
                this.votingStage!.addVote(message.voterId, message.photographerId);
                if (this.votingStage!.haveVotesFromAllUsers(Array.from(this.gameThree.players.keys()))) {
                    this.switchToViewingResultsStage();
                }
                break;
            case GameThreeGameState.FinalVoting:
                this.gameThree.handleFinalPhotoVoteReceived(message);
                break;
        }
    }

    private switchToVotingStage() {
        this.countdown?.stopCountdown();
        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);
        this.updateStage(GameThreeGameState.Voting);
    }

    private switchToViewingResultsStage() {
        this.countdown?.stopCountdown();
        this.updatePlayerPoints();
        this.updateStage(GameThreeGameState.ViewingResults);
    }

    private updatePlayerPoints() {
        this.gameThree.players.forEach(player => {
            if (this.photoStage!.hasSentPhoto(player.id) && this.votingStage!.hasVoted(player.id))
                player.totalPoints = this.votingStage!.getNumberVotes(player.id);
        });
    }
}
