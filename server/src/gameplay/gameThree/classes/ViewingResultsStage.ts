import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { PlayerNameId } from '../interfaces';
import { Stage } from './Stage';

export class ViewingResultsStage extends Stage {
    constructor(roomId: string, players: PlayerNameId[]) {
        super(roomId, players, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
    }

    handleInput(message: IMessage) {
        return;
    }

    hasNextStage(): boolean {
        return false;
    }

    switchToNextStage() {
        //to satisfy compiler
        return this;
    }

    protected countdownOver() {
        this.emitStageChangeEvent();
    }
}
