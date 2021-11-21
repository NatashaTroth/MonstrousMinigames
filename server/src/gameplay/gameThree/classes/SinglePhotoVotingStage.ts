import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PhotoPhotographerMapper, PlayerNameId } from '../interfaces';
import { ViewingResultsStage } from './ViewingResultsStage';
import { VotingStage } from './VotingStage';

export class SinglePhotoVotingStage extends VotingStage {
    //TODO make URL type

    constructor(roomId: string, players: PlayerNameId[], photoUrls: PhotoPhotographerMapper[]) {
        super(roomId, players, photoUrls);
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
    }

    switchToNextStage() {
        // this.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        // this.updatePlayerPointsFromVotes();

        // const photoUrls: PhotoPhotographerMapper[] = this.getPhotos() as PhotoPhotographerMapper[];
        // GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);

        return new ViewingResultsStage(this.roomId, this.players, this.votes.getAllVotes()); //TODO
    }
}
