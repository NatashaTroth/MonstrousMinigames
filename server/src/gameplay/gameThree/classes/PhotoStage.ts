import { IMessage } from '../../../interfaces/messages';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import { IMessagePhoto, PhotosPhotographerMapper, PlayerNameId } from '../interfaces';
import { Photos } from './Photos';
import { Stage } from './Stage';

export abstract class PhotoStage extends Stage {
    protected photos: Photos;

    constructor({
        roomId,
        players: userIds,
        countdownTime,
        maxNumberPhotos = 1,
    }: {
        roomId: string;
        players: PlayerNameId[];
        countdownTime: number;
        maxNumberPhotos?: number;
    }) {
        super(roomId, userIds, countdownTime);
        this.photos = new Photos(maxNumberPhotos);
    }

    abstract switchToNextStage(): Stage;

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO) return;

        const data = message as IMessagePhoto;
        if (this.players.find(player => player.id === data.photographerId))
            this.photos.addPhoto(data.photographerId, data.url);

        if (this.photos.havePhotosFromAllUsers(this.players.map(player => player.id))) {
            this.emitStageChangeEvent();
        }
    }

    protected getPhotos(): PhotosPhotographerMapper[] {
        return this.photos.getPhotos();
    }

    protected getPhotosUrls(): string[] {
        return this.photos.getPhotosUrls();
    }

    protected countdownOver() {
        this.emitStageChangeEvent();
    }
}
