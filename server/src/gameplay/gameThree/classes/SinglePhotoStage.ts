import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { UrlPhotographerMapper } from '../interfaces';
import { PhotoStage } from './PhotoStage';
import { PhotoTopics } from './PhotoTopics';
import { VotingStage } from './VotingStage';

export class SinglePhotoStage extends PhotoStage {
    private photoTopics: PhotoTopics;

    constructor(roomId: string, userIds: string[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        this.photoTopics = new PhotoTopics();
        this.photoTopics.sendNextTopicToClient(roomId);
    }

    switchToNextStage() {
        const photoUrls: UrlPhotographerMapper[] = this.getPhotos().map(photoObject => {
            return { photographerId: photoObject.photographerId, url: photoObject.urls[0] };
        });
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
        return new VotingStage(this.roomId, this.userIds);
    }
}
