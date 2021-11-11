import { GameThreeGameState } from '../enums/GameState';
import GameThree from '../GameThree';

export class StageController {
    stage = GameThreeGameState.BeforeStart; //TODO make private
    private gameThree: GameThree;
    constructor(gameThree: GameThree) {
        this.gameThree = gameThree;
    }

    updateStage(stage: GameThreeGameState) {
        this.stage = stage;
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
                this.gameThree.handleNewRound();
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
}
