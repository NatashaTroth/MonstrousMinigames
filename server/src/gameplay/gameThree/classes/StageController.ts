import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import GameThreePlayer from '../GameThreePlayer';
import { FinalPhotosStage } from './FinalPhotosStage';
import { SinglePhotoStage } from './SinglePhotoStage';
import { Stage } from './Stage';
import StageEventEmitter from './StageEventEmitter';

//TODO maybe also a round handler class
export class StageController {
    private roundIdx = -1;
    private stageEventEmitter: StageEventEmitter;
    private stage?: Stage | null;

    constructor(private roomId: string, private players: Map<string, GameThreePlayer>, private testNumber = 1) {
        this.stageEventEmitter = StageEventEmitter.getInstance(true);
        this.initStageEventEmitter();
        this.handleNewRound();
    }

    initStageEventEmitter() {
        this.stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, message => {
            // console.log('new stage event');
            if (this.stage?.hasNextStage()) this.stage = this.stage?.switchToNextStage();
            else if (this.stage?.isFinalStage()) {
                this.stage = null;
                this.handleGameFinished();
            } else this.handleNewRound();
        });
        // this.stageEventEmitter.on(StageEventEmitter.NEW_ROUND_EVENT, message => {
        //     this.handleNewRound();
        // });
        // this.stageEventEmitter.on(StageEventEmitter.GAME_FINISHED, message => {
        //     // this.stage = null;
        //     // this.handleGameFinished();
        // });
    }

    update(timeElapsedSinceLastFrame: number) {
        this.stage?.update(timeElapsedSinceLastFrame);
    }

    handleNewRound() {
        this.roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.roomId, this.roundIdx);
        const players = Array.from(this.players.values()).map(player => {
            return { id: player.id, name: player.name };
        });
        if (!this.isFinalRound()) {
            this.stage = new SinglePhotoStage(this.roomId, players);
        } else {
            this.stage = new FinalPhotosStage(this.roomId, players);
            // console.log('*******');
            // console.log(this.stage.constructor.name);

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

    //     }
    // }

    // handleStageCountdownOver() {
    //     switch (this.stage) {

    //         case GameThreeGameState.FinalVoting:
    //             this.switchToViewingFinalResultsStage();
    //             break;
    //     }
    // }

    private handleGameFinished() {
        this.stageEventEmitter.emit(StageEventEmitter.GAME_FINISHED);

        //         const playerRanks: GameThreePlayerRank[] = Array.from(this.players.values()).map(player => {
        //     return {
        //         id: player.id,
        //         name: player.name,
        //         points: player.totalPoints,
        //         rank: 0,
        //         isActive: player.isActive,
        //     };
        // });

        // playerRanks
        //     .sort((a, b) => b.points - a.points)
        //     .map(result => {
        //         const rank = this.gameThree.rankSuccessfulUser(result.points); //TODO !!! make this function protected again
        //         this.players.get(result.id)!.rank = rank;
        //         result.rank = rank;
        //         return result;
        //     });

        // this.updateStage(GameThreeGameState.ViewingFinalResults);
        // this.gameThree.gameState = GameState.Finished;
        // GameThreeEventEmitter.emitGameHasFinishedEvent(this.roomId, GameState.Finished, []); //playerRanks);
    }

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

    // private switchToFinalPresentationStage() {
    //     this.addPointPerReceivedPhoto(); //TODO
    //     this.updateStage(GameThreeGameState.PresentingFinalPhotos);
    // }

    // private addPointPerReceivedPhoto() {
    //     this.players.forEach(player => {
    //         player.totalPoints += this.photoStage!.getNumberPhotos();
    //     });
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
