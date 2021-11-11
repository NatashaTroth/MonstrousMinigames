import InitialParameters from '../constants/InitialParameters';
import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';
import GameThreeEventEmitter from '../GameThreeEventEmitter';

export class StageController {
    stage = GameThreeGameState.BeforeStart; //TODO make private
    private gameThree: GameThree;
    private _roundIdx = -1;
    numberRounds = InitialParameters.NUMBER_ROUNDS;

    constructor(gameThree: GameThree) {
        this.gameThree = gameThree;
    }

    updateStage(stage: GameThreeGameState) {
        this.stage = stage;
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
                this.gameThree.handleFinishedTakingPhoto();
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
}
