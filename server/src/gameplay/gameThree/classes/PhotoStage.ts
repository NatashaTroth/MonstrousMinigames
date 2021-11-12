import validator from 'validator';

import { InvalidUrlError } from '../customErrors';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { photoPhotographerMapper } from '../interfaces';

export class PhotoStage {
    //TODO make URL type
    private photos: Map<string, string>;

    constructor() {
        this.photos = new Map<string, string>(); //key = photographerId, value = url
    }

    // *** Taking Photos ***

    private getPhotos(): photoPhotographerMapper[] {
        const photosArray: photoPhotographerMapper[] = [];
        this.photos.forEach((value, key) => photosArray.push({ photographerId: key, url: value }));
        return photosArray;
    }

    sendPhotosToClient(roomId: string, countdownTime: number) {
        const photoUrls = this.getPhotos();
        GameThreeEventEmitter.emitVoteForPhotos(roomId, photoUrls, countdownTime);
    }

    addPhoto(photographerId: string, url: string) {
        if (!validator.isURL(url))
            throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);

        if (!this.photos.has(photographerId)) {
            this.photos.set(photographerId, url);
        }
    }

    havePhotosFromAllUsers(photographerIds: string[]) {
        return photographerIds.every(photographerId => this.photos.has(photographerId));
    }

    hasSentPhoto(photographerId: string) {
        return this.photos.has(photographerId);
    }
}
