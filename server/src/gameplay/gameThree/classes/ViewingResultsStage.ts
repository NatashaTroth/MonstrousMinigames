import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { VotesPhotographerMapper } from '../interfaces';
import { Stage } from './Stage';

export class ViewingResultsStage extends Stage {
    constructor(roomId: string, userIds: string[], votingResults: VotesPhotographerMapper[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        GameThreeEventEmitter.emitPhotoVotingResults(
            roomId,
            votingResults,
            InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS
        );
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

    // switchToNextStage() {
    //     this.stageEventEmitter.emit(StageEventEmitter.NEW_ROUND_EVENT);
    //     return null;
    // }
}
