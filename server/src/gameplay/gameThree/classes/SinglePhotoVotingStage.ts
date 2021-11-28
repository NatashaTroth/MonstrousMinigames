import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { ViewingResultsStage } from './ViewingResultsStage';
import { VotingStage } from './VotingStage';

export class SinglePhotoVotingStage extends VotingStage {
    constructor(roomId: string, players: PlayerNameId[], photographerIds: string[]) {
        super(roomId, players, photographerIds);
    }

    switchToNextStage() {
        const votingResults = this.votes.getAllVotes();
        GameThreeEventEmitter.emitPhotoVotingResults(
            this.roomId,
            votingResults,
            InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS
        );

        return new ViewingResultsStage(this.roomId, this.players);
    }
}
