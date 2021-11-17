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

    // abstract entry(roomId: string): void;
    // entry() {
    //     //TODO
    //     super.entry();
    // }

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

    abstract getPhotos(): UrlPhotographerMapper[] | PhotosPhotographerMapper[];

    getPhotoUrlsFromUser(photographerId: string): string[] {
        return this.photos.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    }

    protected validateUrl(url: string, photographerId: string) {
        //TODO Handle error - send something to client? or not bother with it at all?
        if (!validator.isURL(url))
            throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
    }

    abstract havePhotosFromAllUsers(photographerIds: string[]): boolean;

    // havePhotosFromAllUsers(photographerIds: string[]) {
    //     return photographerIds.every(photographerId => this.photos.has(photographerId));
    // }

    hasAddedPhoto(photographerId: string) {
        return this.photos.has(photographerId);
    }

    abstract getNumberPhotos(photographerId?: string): number;
}
