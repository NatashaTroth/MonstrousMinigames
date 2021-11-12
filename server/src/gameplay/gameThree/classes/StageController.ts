import validator from 'validator';

import InitialParameters from '../constants/InitialParameters';
import { InvalidUrlError } from '../customErrors';
import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { IMessagePhoto, IMessagePhotoVote, PhotoPhotographerMapper } from '../interfaces';
import { Countdown } from './Countdown';
import { MultiplePhotosStage } from './MultiplePhotosStage';
import { PhotoStage } from './PhotoStage';
import { PhotoTopics } from './PhotoTopics';
// import { PresentationController } from './PresentationController';
import { SinglePhotoStage } from './SinglePhotoStage';
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
    private photoTopics: PhotoTopics;
    // private presentationController: PresentationController;

    constructor(gameThree: GameThree) {
        this.gameThree = gameThree;
        this.countdown = new Countdown(this); //TODO remove argument
        this.photoTopics = new PhotoTopics();
    }

    updateStage(stage: GameThreeGameState) {
        //TODO remove argument??
        this.stage = stage;

        switch (stage) {
            case GameThreeGameState.TakingPhoto:
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
                this.photoStage = new SinglePhotoStage();
                break;
            case GameThreeGameState.Voting:
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);

                this.votingStage = new VotingStage();
                break;
            case GameThreeGameState.ViewingResults:
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
                //TODO viewing stage?
                break;
            case GameThreeGameState.TakingFinalPhotos:
                this.photoStage = new MultiplePhotosStage(InitialParameters.NUMBER_FINAL_PHOTOS);
                this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS);
                //TODO viewing stage?
                break;
            // case GameThreeGameState.PresentingFinalPhotos:
            //     this.presentationController = new PresentationController(
            //         Array.from(this.gameThree.players.values()).map(player => player.id)
            //     );
            //     // this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
            //     if (this.presentationController!.isAnotherPresenterAvailable()) {
            //         this.sendFinalPhotosToScreen();
            //     } else {
            //         this.handlePresentingFinalPhotosFinished();
            //     }
            //     break;
        }
    }

    handleNewRound() {
        this._roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.gameThree.roomId, this.roundIdx);
        if (!this.isFinalRound() && this.gameThree.photoTopics!.isAnotherTopicAvailable()) {
            this.switchToTakingPhotoStage();
        } else {
            this.switchToFinalTakingPhotosStage();
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
                this.switchToFinalPresentationStage();
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
                this.photoStage!.addPhoto(message.userId, message.url);
                if (this.photoStage!.havePhotosFromAllUsers(Array.from(this.gameThree.players.keys()))) {
                    this.switchToFinalPresentationStage();
                }

                //TODO add point per photo
                // player.addPointsFinalRound(1);
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

    private switchToTakingPhotoStage() {
        this.photoTopics.sendNextTopicToClient(this.gameThree.roomId);
        this.countdown?.stopCountdown(); //TODO can delete?
        // this.updatePlayerPoints();
        this.updateStage(GameThreeGameState.TakingPhoto);
    }

    private switchToVotingStage() {
        const photoUrls: PhotoPhotographerMapper[] = this.photoStage!.getPhotos() as PhotoPhotographerMapper[];
        GameThreeEventEmitter.emitVoteForPhotos(
            this.gameThree.roomId,
            photoUrls,
            InitialParameters.COUNTDOWN_TIME_VOTE
        );
        this.updateStage(GameThreeGameState.Voting);
    }

    private switchToViewingResultsStage() {
        this.votingStage?.sendPhotoVotingResultsToScreen(
            this.gameThree.roomId,
            InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS
        ); //TODO MAYBE MOVE EMITTER TO HERE
        this.updatePlayerPointsFromVotes();
        this.updateStage(GameThreeGameState.ViewingResults);
    }

    private updatePlayerPointsFromVotes() {
        this.gameThree.players.forEach(player => {
            if (this.photoStage!.hasAddedPhoto(player.id) && this.votingStage!.hasVoted(player.id))
                player.totalPoints += this.votingStage!.getNumberVotes(player.id);
        });
    }

    // ****** final round ******
    private switchToFinalTakingPhotosStage() {
        this.updateStage(GameThreeGameState.TakingFinalPhotos);
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
            this.gameThree.roomId,
            InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS
        );
    }

    private switchToFinalPresentationStage() {
        this.addPointPerReceivedPhoto();
        this.updateStage(GameThreeGameState.PresentingFinalPhotos);
    }

    private addPointPerReceivedPhoto() {
        this.gameThree.players.forEach(player => {
            player.totalPoints += this.photoStage!.getNumberPhotos();
        });
    }
}
