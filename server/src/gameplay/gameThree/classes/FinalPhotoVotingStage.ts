import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { VotingStage } from './VotingStage';

export class FinalPhotosVotingStage extends VotingStage {
    //TODO make URL type

    constructor(roomId: string, players: PlayerNameId[]) {
        super(roomId, players, [], false);
        GameThreeEventEmitter.emitVoteForFinalPhotos(this.roomId, InitialParameters.COUNTDOWN_TIME_VOTE, this.players);
    }

    hasNextStage(): boolean {
        return false;
    }

    isFinalStage(): boolean {
        return true;
    }

    switchToNextStage() {
        // this.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        // this.updatePlayerPointsFromVotes();

        // const photoUrls: PhotoPhotographerMapper[] = this.getPhotos() as PhotoPhotographerMapper[];
        // GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);

        // return new ViewingResultsStage(this.roomId, this.players, this.votes.getAllVotes()); //TODO
        return this;
    }
}
