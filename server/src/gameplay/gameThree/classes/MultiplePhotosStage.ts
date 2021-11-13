import { PhotosPhotographerMapper } from '../interfaces';
import { PhotoStage } from './PhotoStage';

export class MultiplePhotosStage extends PhotoStage {
    protected photos: Map<string, string[]>;

    constructor(private maxNumberPhotos: number) {
        super();
        this.photos = new Map<string, string[]>(); //key = photographerId, value = url
    }

    getPhotos(): PhotosPhotographerMapper[] {
        const photosArray: PhotosPhotographerMapper[] = [];
        this.photos.forEach((value, key) => photosArray.push({ photographerId: key, urls: value }));
        return photosArray;
    }

    addPhoto(photographerId: string, url: string) {
        this.validateUrl(url, photographerId);

        if (!this.photos.has(photographerId)) {
            this.photos.set(photographerId, [url]);
        } else {
            const urls = this.photos.get(photographerId)!;
            if (urls.length < this.maxNumberPhotos) this.photos.set(photographerId, [...urls, url]);
            //TODO control
        }
    }

    havePhotosFromAllUsers(photographerIds: string[]) {
        return photographerIds.every(photographerId => {
            return this.photos.has(photographerId) && this.photos.get(photographerId)!.length === this.maxNumberPhotos;
        });
    }

    getNumberPhotos(photographerId: string) {
        return this.photos.has(photographerId) ? this.photos.get(photographerId)!.length : 0;
    }
}
