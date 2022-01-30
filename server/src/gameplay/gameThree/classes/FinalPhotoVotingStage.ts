import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { VotingStage } from './VotingStage';

export class FinalPhotosVotingStage extends VotingStage {
    constructor(roomId: string, players: PlayerNameId[]) {
        super(roomId, players, [], InitialParameters.POINTS_PER_VOTE_FINAL_ROUND, false);
        GameThreeEventEmitter.emitVoteForFinalPhotos(this.roomId, InitialParameters.COUNTDOWN_TIME_VOTE, this.players);
    }

    switchToNextStage() {
        return null;
    }
}
