import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import GameThreePlayer from '../GameThreePlayer';
import { SinglePhotoStage } from './SinglePhotoStage';
import { Stage } from './Stage';
import StageEventEmitter from './StageEventEmitter';

//TODO maybe also a round handler class
export class StageController {
    private roundIdx = -1;
    private stageEventEmitter: StageEventEmitter;
    private stage?: Stage;

    constructor(private roomId: string, private players: Map<string, GameThreePlayer>, private testNumber = 1) {
        this.stageEventEmitter = StageEventEmitter.getInstance(true);
        this.initStageEventEmitter();
        this.handleNewRound();
    }

    initStageEventEmitter() {
        this.stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, message => {
            this.stage = this.stage?.switchToNextStage();
        });
        this.stageEventEmitter.on(StageEventEmitter.NEW_ROUND_EVENT, message => {
            this.handleNewRound();
        });
    }

    update(timeElapsedSinceLastFrame: number) {
        this.stage?.update(timeElapsedSinceLastFrame);
    }

    handleNewRound() {
        this.roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.roomId, this.roundIdx);
        if (!this.isFinalRound()) {
            this.stage = new SinglePhotoStage(this.roomId, Array.from(this.players.keys()));
        } else {
            //TODO call remove all stage event listeners
            // this.switchToFinalTakingPhotosStage();
        }
    }

    handleInput(message: IMessage) {
        // console.log('handleInput ', message);
        this.stage?.handleInput(message);
    }

    // updateStage(stage: GameThreeGameState) {
    //     //TODO remove argument??
    //     this.stage = stage;
    //         case GameThreeGameState.FinalVoting:
    //             this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);
    //             this.votingStage = new VotingStage();
    //             break;
    //         case GameThreeGameState.TakingFinalPhotos:
    //             this.photoStage = new MultiplePhotosStage(InitialParameters.NUMBER_FINAL_PHOTOS);
    //             this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
    //             //TODO viewing stage?
    //             break;
    //         case GameThreeGameState.PresentingFinalPhotos:
    //             this.presentationStage = new PresentationStage(
    //                 Array.from(this.players.values()).map(player => player.id)
    //             );
    //             this.handleNewPresentationRound();
    //             break;
    //         // case GameThreeGameState.FinalVoting:
    //         //     this.countdown?.initiateCountdown(InitialParameters.COUNTDOWN_TIME_VOTE);

    //         //     this.presentationStage = new PresentationStage(
    //         //         Array.from(this.players.values()).map(player => player.id)
    //         //     );
    //         //     this.handleNewPresentationRound();
    //         //     break;
    //     }
    // }

    // handleStageCountdownOver() {
    //     switch (this.stage) {

    //         case GameThreeGameState.ViewingResults:
    //             this.handleNewRound();
    //             break;
    //         case GameThreeGameState.TakingFinalPhotos:
    //             this.switchToFinalPresentationStage();
    //             break;
    //         case GameThreeGameState.PresentingFinalPhotos:
    //             this.handleNewPresentationRound();
    //             break;
    //         case GameThreeGameState.FinalVoting:
    //             this.switchToViewingFinalResultsStage();
    //             break;
    //     }
    // }

    private isFinalRound() {
        return this.roundIdx >= InitialParameters.NUMBER_ROUNDS;
    }

    // // ********** new ************

    // private switchToViewingResultsStage() {
    // TODO
    //     this.updatePlayerPointsFromVotes();
    // }

    // private updatePlayerPointsFromVotes() {
    //     this.players.forEach(player => {
    //         if (this.photoStage!.hasAddedPhoto(player.id) && this.votingStage!.hasVoted(player.id))
    //             player.totalPoints += this.votingStage!.getNumberVotes(player.id);
    //     });
    // }

    // // ****** final round ******
    // private switchToFinalTakingPhotosStage() {
    //     this.updateStage(GameThreeGameState.TakingFinalPhotos);
    //     GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
    //         this.roomId,
    //         InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS
    //     );
    // }

    // private switchToFinalPresentationStage() {
    //     this.addPointPerReceivedPhoto();
    //     this.updateStage(GameThreeGameState.PresentingFinalPhotos);
    // }

    // private addPointPerReceivedPhoto() {
    //     this.players.forEach(player => {
    //         player.totalPoints += this.photoStage!.getNumberPhotos();
    //     });
    // }

    // handleNewPresentationRound() {
    //     if (this.presentationStage!.isAnotherPresenterAvailable()) {
    //         const nextPresenterId = this.presentationStage!.nextPresenter();
    //         const photoUrls = this.photoStage!.getPhotoUrlsFromUser(nextPresenterId);

    //         GameThreeEventEmitter.emitPresentFinalPhotosCountdown(
    //             this.roomId,
    //             InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS,
    //             nextPresenterId,
    //             this.players.get(nextPresenterId)!.name,
    //             photoUrls
    //         );
    //         this.countdown.initiateCountdown(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
    //     } else {
    //         this.switchToFinalVotingStage();
    //     }
    // }

    // private switchToFinalVotingStage() {
    //     const playerNameIds: PlayerNameId[] = Array.from(this.players.values()).map(player => {
    //         return { id: player.id, name: player.name };
    //     });

    //     GameThreeEventEmitter.emitVoteForFinalPhotos(this.roomId, InitialParameters.COUNTDOWN_TIME_VOTE, playerNameIds);
    //     this.updateStage(GameThreeGameState.FinalVoting);
    // }

    // private switchToViewingFinalResultsStage() {
    //     const playerRanks: GameThreePlayerRank[] = Array.from(this.players.values()).map(player => {
    //         return {
    //             id: player.id,
    //             name: player.name,
    //             points: player.totalPoints,
    //             rank: 0,
    //             isActive: player.isActive,
    //         };
    //     });

    //     playerRanks
    //         .sort((a, b) => b.points - a.points)
    //         .map(result => {
    //             const rank = this.gameThree.rankSuccessfulUser(result.points); //TODO !!! make this function protected again
    //             this.players.get(result.id)!.rank = rank;
    //             result.rank = rank;
    //             return result;
    //         });

    //     this.updateStage(GameThreeGameState.ViewingFinalResults);
    //     this.gameThree.gameState = GameState.Finished;
    //     GameThreeEventEmitter.emitGameHasFinishedEvent(this.roomId, this.gameThree.gameState, playerRanks);

    //     //TODO Leaderboard
    // }
}
