import validator from 'validator';

import { GameState } from '../../enums';
import InitialParameters from '../constants/InitialParameters';
import { InvalidUrlError } from '../customErrors';
import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import GameThreePlayer from '../GameThreePlayer';
import {
    IMessagePhoto, IMessagePhotoVote, PhotoPhotographerMapper, PlayerNameId
} from '../interfaces';
import { GameThreePlayerRank } from '../interfaces/GameThreePlayerRank';
import {
    Countdown, MultiplePhotosStage, PhotoStage, PhotoTopics, PresentationStage, SinglePhotoStage,
    VotingStage
} from './';

//TODO maybe also a round handler class
export class StageController {
    private stage = GameThreeGameState.BeforeStart; //TODO make private
    // private gameThree: GameThree;
    private roundIdx = -1;
    private photoStage?: PhotoStage;
    private votingStage?: VotingStage;
    private countdown: Countdown;
    private photoTopics: PhotoTopics;
    private presentationStage?: PresentationStage;

    constructor(private roomId: string, private players: Map<string, GameThreePlayer>, private gameThree: GameThree) {
        // this.gameThree = gameThree;
        this.countdown = new Countdown(this); //TODO remove argument
        this.photoTopics = new PhotoTopics();
    }

    update(timeElapsedSinceLastFrame: number) {
        this.countdown.update(timeElapsedSinceLastFrame);
        if (this.countdown.countdownOver()) this.handleStageCountdownOver();
    }

    handleNewRound() {
        this.roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.roomId, this.roundIdx);
        if (!this.isFinalRound() && this.photoTopics!.isAnotherTopicAvailable()) {
            this.switchToTakingPhotoStage();
        } else {
            this.switchToFinalTakingPhotosStage();
        }
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
            case GameThreeGameState.FinalVoting:
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
            case GameThreeGameState.PresentingFinalPhotos:
                this.presentationStage = new PresentationStage(
                    Array.from(this.players.values()).map(player => player.id)
                );
                this.handleNewPresentationRound();
                break;
            // case GameThreeGameState.FinalVoting:
            //     this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);

            //     this.presentationStage = new PresentationStage(
            //         Array.from(this.players.values()).map(player => player.id)
            //     );
            //     this.handleNewPresentationRound();
            //     break;
        }
    }

    handleStageCountdownOver() {
        switch (this.stage) {
            case GameThreeGameState.TakingPhoto:
                this.switchToVotingStage();
                break;
            case GameThreeGameState.Voting:
                this.switchToViewingResultsStage();
                break;
            case GameThreeGameState.ViewingResults:
                this.handleNewRound();
                break;
            case GameThreeGameState.TakingFinalPhotos:
                this.switchToFinalPresentationStage();
                break;
            case GameThreeGameState.PresentingFinalPhotos:
                this.handleNewPresentationRound();
                break;
            case GameThreeGameState.FinalVoting:
                this.switchToViewingFinalResultsStage();
                break;
        }
    }

    private isFinalRound() {
        return this.roundIdx >= InitialParameters.NUMBER_ROUNDS;
    }

    // ********** new ************

    handleReceivedPhoto(message: IMessagePhoto) {
        if (!validator.isURL(message.url))
            throw new InvalidUrlError('The received value for the URL is not valid.', message.userId);
        this.photoStage!.handleInput({ photographerId: message.userId, url: message.url });

        if (this.photoStage!.havePhotosFromAllUsers(Array.from(this.players.keys()))) {
            this.stage === GameThreeGameState.TakingPhoto
                ? this.switchToVotingStage()
                : this.switchToFinalPresentationStage();
        }
    }

    handleReceivedPhotoVote(message: IMessagePhotoVote) {
        this.votingStage!.handleInput({ voterId: message.voterId, photographerId: message.photographerId });
        if (this.votingStage!.haveVotesFromAllUsers(Array.from(this.players.keys()))) {
            this.stage === GameThreeGameState.Voting
                ? this.switchToViewingResultsStage()
                : this.switchToViewingFinalResultsStage();
        }
    }

    private switchToTakingPhotoStage() {
        this.photoTopics.sendNextTopicToClient(this.roomId);
        this.countdown?.resetCountdown(); //TODO can delete?
        // this.updatePlayerPoints();
        this.updateStage(GameThreeGameState.TakingPhoto);
    }

    private switchToVotingStage() {
        const photoUrls: PhotoPhotographerMapper[] = this.photoStage!.getPhotos() as PhotoPhotographerMapper[];
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
        this.updateStage(GameThreeGameState.Voting);
    }

    private switchToViewingResultsStage() {
        this.votingStage?.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS); //TODO MAYBE MOVE EMITTER TO HERE
        this.updatePlayerPointsFromVotes();
        this.updateStage(GameThreeGameState.ViewingResults);
    }

    private updatePlayerPointsFromVotes() {
        this.players.forEach(player => {
            if (this.photoStage!.hasAddedPhoto(player.id) && this.votingStage!.hasVoted(player.id))
                player.totalPoints += this.votingStage!.getNumberVotes(player.id);
        });
    }

    // ****** final round ******
    private switchToFinalTakingPhotosStage() {
        this.updateStage(GameThreeGameState.TakingFinalPhotos);
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
            this.roomId,
            InitialParameters.COUNTDOWN_TIME_TAKE_FINAL_PHOTOS
        );
    }

    private switchToFinalPresentationStage() {
        this.addPointPerReceivedPhoto();
        this.updateStage(GameThreeGameState.PresentingFinalPhotos);
    }

    private addPointPerReceivedPhoto() {
        this.players.forEach(player => {
            player.totalPoints += this.photoStage!.getNumberPhotos();
        });
    }

    handleNewPresentationRound() {
        if (this.presentationStage!.isAnotherPresenterAvailable()) {
            const nextPresenterId = this.presentationStage!.nextPresenter();
            const photoUrls = this.photoStage!.getPhotoUrlsFromUser(nextPresenterId);

            GameThreeEventEmitter.emitPresentFinalPhotosCountdown(
                this.roomId,
                InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS,
                nextPresenterId,
                this.players.get(nextPresenterId)!.name,
                photoUrls
            );
            this.countdown.initiateCountdown(InitialParameters.COUNTDOWN_TIME_PRESENT_FINAL_PHOTOS);
        } else {
            this.switchToFinalVotingStage();
        }
    }

    private switchToFinalVotingStage() {
        const playerNameIds: PlayerNameId[] = Array.from(this.players.values()).map(player => {
            return { id: player.id, name: player.name };
        });

        GameThreeEventEmitter.emitVoteForFinalPhotos(this.roomId, InitialParameters.COUNTDOWN_TIME_VOTE, playerNameIds);
        this.updateStage(GameThreeGameState.FinalVoting);
    }

    private switchToViewingFinalResultsStage() {
        const playerRanks: GameThreePlayerRank[] = Array.from(this.players.values()).map(player => {
            return {
                id: player.id,
                name: player.name,
                points: player.totalPoints,
                rank: 0,
                isActive: player.isActive,
            };
        });

        playerRanks
            .sort((a, b) => b.points - a.points)
            .map(result => {
                const rank = this.gameThree.rankSuccessfulUser(result.points); //TODO !!! make this function protected again
                this.players.get(result.id)!.rank = rank;
                result.rank = rank;
                return result;
            });

        this.updateStage(GameThreeGameState.ViewingFinalResults);
        this.gameThree.gameState = GameState.Finished;
        GameThreeEventEmitter.emitGameHasFinishedEvent(this.roomId, this.gameThree.gameState, playerRanks);

        //TODO Leaderboard
    }
}
