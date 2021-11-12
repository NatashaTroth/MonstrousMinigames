import InitialParameters from '../constants/InitialParameters';
import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { Countdown } from './Countdown';
import { PhotoStage } from './PhotoStage';

export class StageController {
    stage = GameThreeGameState.BeforeStart; //TODO make private
    private gameThree: GameThree;
    private _roundIdx = -1;
    numberRounds = InitialParameters.NUMBER_ROUNDS;
    private photoStage?: PhotoStage;
    private countdown?: Countdown;

    constructor(gameThree: GameThree) {
        this.gameThree = gameThree;
    }

    updateStage(stage: GameThreeGameState) {
        this.stage = stage;

        switch (stage) {
            case GameThreeGameState.TakingPhoto:
                this.photoStage = new PhotoStage();
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
                this.handleFinishedTakingPhoto();
                break;
            case GameThreeGameState.Voting:
                this.gameThree.handleFinishedVoting();
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
    handleFinishedTakingPhoto() {
        this.sendPhotosToScreen();
    }

    private sendPhotosToScreen() {
        const photoUrls = this.photoStage!.getPhotos();

        this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);
        this.updateStage(GameThreeGameState.Voting);
        GameThreeEventEmitter.emitVoteForPhotos(
            this.gameThree.roomId,
            photoUrls,
            InitialParameters.COUNTDOWN_TIME_VOTE
        );
    }
}
