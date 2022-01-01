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
    private roundIdx = 0;
    private stageEventEmitter: StageEventEmitter;
    private stage?: Stage | null;
    private playerPoints: PlayerPoints;

    constructor(private roomId: string, private players: PlayerNameId[], private testNumber = 1) {
        this.stageEventEmitter = StageEventEmitter.getInstance(true);
        this.initStageEventEmitter();
        this.handleNewRound();
        this.playerPoints = new PlayerPoints(players);
    }

    private initStageEventEmitter() {
        this.stageEventEmitter.on(StageEventEmitter.STAGE_CHANGE_EVENT, message => {
            // console.log('NEW STAGE');
            this.playerPoints.addPointsToMultiplePlayers(this.stage?.updatePlayerPoints());
            this.stage = this.stage?.switchToNextStage();
            if (!this.stage) {
                if (this.isFinalRound()) {
                    this.handleGameFinished();
                } else this.handleNewRound();
            }
        });
    }

    update(timeElapsedSinceLastFrame: number) {
        this.stage?.update(timeElapsedSinceLastFrame);
    }

    handleNewRound() {
        this.roundIdx++;
        GameThreeEventEmitter.emitNewRound(this.roomId, this.roundIdx);

        if (this.isFinalRound()) {
            this.stage = new FinalPhotosStage(this.roomId, this.players);
        } else if (this.roundIdx > InitialParameters.NUMBER_ROUNDS) {
            this.stage = null;
            this.handleGameFinished();
        } else {
            this.stage = new SinglePhotoStage(this.roomId, this.players);
        }
    }

    handleInput(message: IMessage) {
        this.stage!.handleInput(message);
    }

    getPlayerPoints(): Map<string, number> {
        return this.playerPoints.getAllPlayerPoints();
    }

    public get currentStage(): Stage | null | undefined {
        return this.stage;
    }

    private handleGameFinished() {
        this.stageEventEmitter.emit(StageEventEmitter.GAME_FINISHED);
    }

    private isFinalRound() {
        return this.roundIdx === InitialParameters.NUMBER_ROUNDS;
    }
}
