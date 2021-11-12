import validator from 'validator';

import { InvalidUrlError } from '../customErrors';
import { PhotoPhotographerMapper } from '../interfaces';
import { PhotoStage } from './PhotoStage';

export class SinglePhotoStage extends PhotoStage {
    protected photos: Map<string, string>;

    constructor() {
        super();
        this.photos = new Map<string, string>(); //key = photographerId, value = url
    }

    getPhotos(): PhotoPhotographerMapper[] {
        const photosArray: PhotoPhotographerMapper[] = [];
        this.photos.forEach((value, key) => photosArray.push({ photographerId: key, url: value }));
        return photosArray;
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

    // *** TODO: only to satisfy parent class - don't need - remove
    getNumberPhotos() {
        return 1;
    }

    //  getPhotoUrlsFromUser(photographerId): string {
    //      return
    //  }
}
