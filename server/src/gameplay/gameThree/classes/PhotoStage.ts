import validator from 'validator';

import { InvalidUrlError } from '../customErrors';
import { PhotosPhotographerMapper, UrlPhotographerMapper } from '../interfaces';
import { PhotoInput, Stage } from './Stage';

export abstract class PhotoStage extends Stage {
    protected abstract countdownTime: number;

    //TODO make URL type
    protected abstract photos: Map<string, string | string[]>;

    // abstract entry(roomId: string): void;
    entry(roomId: string) {
        //TODO
        super.entry(roomId);
    }

    update(timeElapsedSinceLastFrame: number) {
        super.update(timeElapsedSinceLastFrame);
    }

    abstract handleInput(data: PhotoInput): void;

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
