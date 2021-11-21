import InitialParameters from '../constants/InitialParameters';
import { PhotoPhotographerMapper, PlayerNameId } from '../interfaces';
import { PhotoStage } from './PhotoStage';
import { PhotoTopics } from './PhotoTopics';
import { SinglePhotoVotingStage } from './SinglePhotoVotingStage';

export class SinglePhotoStage extends PhotoStage {
    private photoTopics: PhotoTopics;

    constructor(roomId: string, players: PlayerNameId[]) {
        super({ roomId, players: players, countdownTime: InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO });
        this.photoTopics = new PhotoTopics();
        this.photoTopics.sendNextTopicToClient(roomId);
    }

    switchToNextStage() {
        const photoUrls: PhotoPhotographerMapper[] = this.getPhotos().map(photoObject => {
            return { photographerId: photoObject.photographerId, url: photoObject.urls[0] };
        });
        return new SinglePhotoVotingStage(this.roomId, this.players, photoUrls);
    }
}
