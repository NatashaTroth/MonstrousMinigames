import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
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
        super(roomId, userIds, countdownTime + InitialParameters.RECEIVE_PHOTOS_BUFFER_TIME);
        this.photos = new Photos(maxNumberPhotos);
    }

    abstract switchToNextStage(): Stage | null;

    handleInput(message: IMessage) {
        if (message.type === GameThreeMessageTypes.PHOTO_UPLOAD_ERROR) {
            console.log('ERROR UPLOADING PHOTO');
            console.log((message as { type: GameThreeMessageTypes; errorMsg: string }).errorMsg);
        }
        if (message.type !== GameThreeMessageTypes.PHOTO) return;
        this.addPhoto(message as IMessagePhoto);
    }

    private addPhoto(data: IMessagePhoto) {
        console.log('***Recieved photo url*** ' + data.url);

        if (
            this.players.find(player => {
                return player.id === data.photographerId;
            })
        ) {
            this.photos.addPhoto(data.photographerId, data.url);
        }

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
