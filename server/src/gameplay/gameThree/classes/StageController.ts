import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { FinalPhotosStage } from './FinalPhotosStage';
import { PlayerPoints } from './PlayerPoints';
import { SinglePhotoStage } from './SinglePhotoStage';
import { Stage } from './Stage';
import StageEventEmitter from './StageEventEmitter';

//TODO maybe also a round handler class
export class StageController {
    private roundIdx = -1;
    private stageEventEmitter: StageEventEmitter;
    private stage?: Stage | null;
    private playerPoints: PlayerPoints;

    constructor(private roomId: string, private players: PlayerNameId[], private testNumber = 1) {
        this.stageEventEmitter = StageEventEmitter.getInstance(true);
        this.initStageEventEmitter();
        this.handleNewRound();
        this.playerPoints = new PlayerPoints(players);
    }

    initStageEventEmitter() {
        this.stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, message => {
            // console.log('new stage event');
            if (this.stage?.hasNextStage()) {
                this.playerPoints.addAllPlayerPoints(this.stage?.updatePlayerPoints());
                this.stage = this.stage?.switchToNextStage();
            } else if (this.stage?.isFinalStage()) {
                this.stage = null;
                this.handleGameFinished();
            } else this.handleNewRound();
        });
    }

    update(timeElapsedSinceLastFrame: number) {
        this.stage?.update(timeElapsedSinceLastFrame);
    }

    handleNewRound() {
        this.roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.roomId, this.roundIdx);

        if (!this.isFinalRound()) {
            this.stage = new SinglePhotoStage(this.roomId, this.players);
        } else {
            this.stage = new FinalPhotosStage(this.roomId, this.players);
        }
    }

    handleInput(message: IMessage) {
        this.stage?.handleInput(message);
    }

    getPlayerPoints(): Map<string, number> {
        return this.playerPoints.getAllPlayerPoints();
    }

    private handleGameFinished() {
        this.stageEventEmitter.emit(StageEventEmitter.GAME_FINISHED);
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
    // }

    // private addPointPerReceivedPhoto() {
    //     this.players.forEach(player => {
    //         player.totalPoints += this.photoStage!.getNumberPhotos();
    //     });
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

    //     //TODO Leaderboard
    // }
}
