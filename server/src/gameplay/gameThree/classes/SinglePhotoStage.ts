import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PhotoPhotographerMapper, PlayerNameId } from '../interfaces';
import { PhotoStage } from './PhotoStage';
import { PhotoTopics } from './PhotoTopics';
import { SinglePhotoVotingStage } from './SinglePhotoVotingStage';

export class SinglePhotoStage extends PhotoStage {
    private photoTopics: PhotoTopics;

    constructor(roomId: string, players: PlayerNameId[]) {
        super({ roomId, players: players, countdownTime: InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO });
        this.photoTopics = new PhotoTopics();

        if (this.photoTopics.isAnotherTopicAvailable()) {
            GameThreeEventEmitter.emitNewTopic(
                roomId,
                this.photoTopics.nextTopic()!,
                InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO
            );
        }
    }

    switchToNextStage() {
        const photoUrls: PhotoPhotographerMapper[] = this.getPhotos().map(photoObject => {
            return { photographerId: photoObject.photographerId, url: photoObject.urls[0] };
        });
        return new SinglePhotoVotingStage(this.roomId, this.players, photoUrls);
    }
}
