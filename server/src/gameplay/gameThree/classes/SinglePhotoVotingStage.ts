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

    // if only one player took a photo, they will not be able to vote, but the voting should end when all the other players have voted
    getVoters(): string[] {
        if (this.photographerIds.length === 1) {
            return this.players.filter(player => player.id !== this.photographerIds[0]).map(player => player.id);
        } else {
            return super.getVoters();
        }
    }
}
