import { IMessage } from '../../../interfaces/messages';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import { IMessagePhoto, PhotosPhotographerMapper } from '../interfaces';
import { Photos } from './Photos';
import { Stage } from './Stage';

export abstract class PhotoStage extends Stage {
    protected photos: Photos;

    constructor(roomId: string, userIds: string[], countdownTime: number, maxNumberPhotos = 1) {
        super(roomId, userIds, countdownTime);
        this.photos = new Photos(maxNumberPhotos);
    }

    abstract switchToNextStage(): Stage;

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO) return;

        const data = message as IMessagePhoto;
        this.photos.addPhoto(data.photographerId, data.url);

        if (this.photos.havePhotosFromAllUsers(this.userIds)) {
            // console.log('HAVE allllllll photos');
            this.emitStageChangeEvent();
        }
    }

    protected getPhotos(): PhotosPhotographerMapper[] {
        return this.photos.getPhotos();
    }
}
