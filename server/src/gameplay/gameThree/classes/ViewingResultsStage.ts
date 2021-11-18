import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { VotesPhotographerMapper } from '../interfaces';
import { SinglePhotoStage } from './SinglePhotoStage';
import { Stage } from './Stage';

export class ViewingResultsStage extends Stage {
    //TODO make URL type

    constructor(roomId: string, userIds: string[], votingResults: VotesPhotographerMapper[]) {
        // console.log('new viewing stage');
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

    switchToNextStage() {
        // this.sendPhotoVotingResultsToScreen(this.roomId, InitialParameters.COUNTDOWN_TIME_VIEW_RESULTS);
        // this.updatePlayerPointsFromVotes();

        // const photoUrls: UrlPhotographerMapper[] = this.getPhotos() as UrlPhotographerMapper[];
        // GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
        // return new VotingStage(this.roomId, this.userIds);

        return new SinglePhotoStage(this.roomId, this.userIds); //TODO
    }
}
