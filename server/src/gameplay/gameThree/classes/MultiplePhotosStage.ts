import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PhotoStage } from './PhotoStage';

export class MultiplePhotosStage extends PhotoStage {
    constructor(roomId: string, userIds: string[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS);
        GameThreeEventEmitter.emitTakeFinalPhotosCountdown(
            roomId,
            InitialParameters.COUNTDOWN_TIME_TAKE_MULTIPLE_PHOTOS
        );
    }

    switchToNextStage() {
        // const photoUrls: UrlPhotographerMapper[] = this.getPhotos().map(photoObject => {
        //     return { photographerId: photoObject.photographerId, url: photoObject.urls[0] };
        // });
        // return new VotingStage(this.roomId, this.userIds, photoUrls);
        return this;
    }

    //TODO
    // private addPointPerReceivedPhoto() {
    //     this.players.forEach(player => {
    //         player.totalPoints += this.photoStage!.getNumberPhotos();
    //     });
    // }
}
