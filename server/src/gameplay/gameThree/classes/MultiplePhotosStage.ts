import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PhotosPhotographerMapper } from '../interfaces';
import { PhotoStage } from './PhotoStage';
import { PresentationStage } from './PresentationStage';

export class MultiplePhotosStage extends PhotoStage {
    constructor(roomId: string, userIds: string[]) {
        super(
            roomId,
            userIds,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS,
            InitialParameters.NUMBER_FINAL_PHOTOS
        );
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
            roomId,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS
        );
    }

    switchToNextStage() {
        const photoUrls: PhotosPhotographerMapper[] = this.getPhotos().map(photoObject => {
            return { photographerId: photoObject.photographerId, urls: photoObject.urls };
        });
        return new PresentationStage(this.roomId, this.userIds, photoUrls);
    }

    //TODO
    // private addPointPerReceivedPhoto() {
    //     this.players.forEach(player => {
    //         player.totalPoints += this.photoStage!.getNumberPhotos();
    //     });
    // }
}
