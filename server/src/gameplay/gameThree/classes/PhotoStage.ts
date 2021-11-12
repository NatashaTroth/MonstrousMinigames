import validator from 'validator';

import { InvalidUrlError } from '../customErrors';
import { PhotoPhotographerMapper, PhotosPhotographerMapper } from '../interfaces';

export abstract class PhotoStage {
    //TODO make URL type
    protected abstract photos: Map<string, string | string[]>;

    abstract getPhotos(): PhotoPhotographerMapper[] | PhotosPhotographerMapper[];

    getPhotoUrlsFromUser(photographerId: string): string[] {
        return this.photos.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    }

    // private getPhotos(): PhotoPhotographerMapper[] {
    //     const photosArray: PhotoPhotographerMapper[] = [];
    //     this.photos.forEach((value, key) => photosArray.push({ photographerId: key, url: value }));
    //     return photosArray;
    // }

    // sendPhotosToClient(roomId: string, countdownTime: number) {
    //     const photoUrls = this.getPhotos();
    //     GameThreeEventEmitter.emitVoteForPhotos(roomId, photoUrls, countdownTime);
    // }

    abstract addPhoto(photographerId: string, url: string): void;

    verifyUrl(url: string, photographerId: string) {
        //TODO MOVE TO URL CLASS
        if (!validator.isURL(url))
            throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
    }

    // addPhoto(photographerId: string, url: string) {
    //     if (!validator.isURL(url))
    //         throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);

    //     if (!this.photos.has(photographerId)) {
    //         this.photos.set(photographerId, url);
    //     }
    //     else{
    //         this.addNewUrl()
    //     }
    // }

    abstract havePhotosFromAllUsers(photographerIds: string[]): boolean;

    // havePhotosFromAllUsers(photographerIds: string[]) {
    //     return photographerIds.every(photographerId => this.photos.has(photographerId));
    // }

    hasAddedPhoto(photographerId: string) {
        return this.photos.has(photographerId);
    }

    abstract getNumberPhotos(photographerId?: string): number;
}
