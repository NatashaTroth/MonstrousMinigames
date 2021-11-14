import { UrlPhotographerMapper } from '../interfaces';
import { PhotoStage } from './PhotoStage';
import { PhotoInput } from './Stage';

export class SinglePhotoStage extends PhotoStage {
    protected photos: Map<string, string>;

    constructor() {
        super();
        this.photos = new Map<string, string>(); //key = photographerId, value = url
    }

    entry() {
        //TODO
    }

    getPhotos(): UrlPhotographerMapper[] {
        const photosArray: UrlPhotographerMapper[] = [];
        this.photos.forEach((value, key) => photosArray.push({ photographerId: key, url: value }));
        return photosArray;
    }

    handleInput(data: PhotoInput) {
        // if (!validator.isURL(url))
        //     throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
        this.validateUrl(data.url, data.photographerId);

        if (!this.photos.has(data.photographerId)) {
            this.photos.set(data.photographerId, data.url);
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
