import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PhotoPhotographerMapper, PlayerNameId } from '../interfaces';
import { VotingStage } from './VotingStage';

export class MultiplePhotosVotingStage extends VotingStage {
    //TODO make URL type

    constructor(roomId: string, players: PlayerNameId[], photoUrls: PhotoPhotographerMapper[]) {
        super(roomId, players, photoUrls);
        GameThreeEventEmitter.emitVoteForFinalPhotos(this.roomId, InitialParameters.COUNTDOWN_TIME_VOTE, this.players);
    }

    hasNextStage(): boolean {
        return false;
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
