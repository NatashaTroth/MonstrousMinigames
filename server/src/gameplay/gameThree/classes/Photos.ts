import validator from 'validator';

import { PhotosPhotographerMapper } from '../interfaces';

export class Photos {
    private photos: Map<string, string[]>;

    constructor(private maxNumberPhotos: number) {
        this.photos = new Map<string, string[]>(); //key = photographerId, value = url
    }

    getPhotos(): PhotosPhotographerMapper[] {
        const photosArray: PhotosPhotographerMapper[] = [];
        this.photos.forEach((value, key) => photosArray.push({ photographerId: key, urls: value }));
        return photosArray;
    }

    getPhotosUrls(): string[] {
        const urlsArray: string[] = [];
        this.photos.forEach((value, key) => urlsArray.push(...value));
        return urlsArray;
    }

    addPhoto(photographerId: string, url: string) {
        if (!validator.isURL(url)) return;

        if (!this.photos.has(photographerId)) {
            this.photos.set(photographerId, [url]);
        } else {
            const urls = this.photos.get(photographerId)!;
            if (urls.length < this.maxNumberPhotos) this.photos.set(photographerId, [...urls, url]);
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
