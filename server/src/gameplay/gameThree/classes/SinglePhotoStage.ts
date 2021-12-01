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
        GameThreeEventEmitter.emitNewTopic(
            roomId,
            this.photoTopics.nextTopic()!,
            InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO
        );
    }

    switchToNextStage() {
        const photoUrls: PhotoPhotographerMapper[] = this.getPhotos().map((photoObject, idx) => {
            return { photographerId: photoObject.photographerId, photoId: idx + 1, url: photoObject.urls[0] };
        });
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
        return new SinglePhotoVotingStage(
            this.roomId,
            this.players,
            photoUrls.map(photoUrlObj => photoUrlObj.photographerId)
        );
    }
}
