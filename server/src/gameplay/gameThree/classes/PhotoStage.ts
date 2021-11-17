import validator from 'validator';

import { IMessage } from '../../../interfaces/messages';
import { InvalidUrlError } from '../customErrors';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import { IMessagePhoto, PhotosPhotographerMapper, UrlPhotographerMapper } from '../interfaces';
import { PhotoInput, Stage } from './Stage';

export abstract class PhotoStage extends Stage {
    // protected abstract countdownTime: number;

    //TODO make URL type
    protected abstract photos: Map<string, string | string[]>;

    constructor(roomId: string, userIds: string[], countdownTime: number) {
        super(roomId, userIds, countdownTime);
    }

    abstract switchToNextStage(): Stage;

    // update(timeElapsedSinceLastFrame: number) {
    //     super.update(timeElapsedSinceLastFrame);
    // }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.PHOTO) return;
        const data = message as IMessagePhoto;
        this.validateUrl(data.url, data.photographerId);

        this.addPhoto(data.photographerId, data.url);
        if (this.havePhotosFromAllUsers(this.userIds)) {
            this.emitStageChangeEvent();
        }
    }

    protected abstract addPhoto(photographerId: string, url: string): void;

    protected abstract getPhotos(): UrlPhotographerMapper[] | PhotosPhotographerMapper[];

    // getPhotoUrlsFromUser(photographerId: string): string[] {
    //     return this.photos.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    // }

    private validateUrl(url: string, photographerId: string) {
        //TODO Handle error - send something to client? or not bother with it at all?
        if (!validator.isURL(url))
            throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
    }

    // protected abstract havePhotosFromAllUsers(photographerIds: string[]): boolean;

    private havePhotosFromAllUsers(photographerIds: string[]) {
        return photographerIds.every(photographerId => this.photos.has(photographerId));
    }

    protected abstract hasAddedPhoto(photographerId: string): boolean;
}
