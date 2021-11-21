import validator from 'validator';

import { InvalidUrlError } from '../customErrors';
import { PhotosPhotographerMapper } from '../interfaces';

export class Photos {
    //TODO make URL type
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
        this.validateUrl(url, photographerId);

        if (!this.photos.has(photographerId)) {
            this.photos.set(photographerId, [url]);
        } else {
            const urls = this.photos.get(photographerId)!;
            if (urls.length < this.maxNumberPhotos) this.photos.set(photographerId, [...urls, url]);
            //TODO control
        }
    }

    getPhotoUrlsFromUser(photographerId: string): string[] {
        return this.photos.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    }

    havePhotosFromAllUsers(photographerIds: string[]) {
        // console.log('-----');
        return photographerIds.every(photographerId => {
            // console.log(this.photos.get(photographerId)!.length);
            // console.log(this.maxNumberPhotos);
            return this.photos.has(photographerId) && this.photos.get(photographerId)!.length === this.maxNumberPhotos;
        });
    }

    validateUrl(url: string, photographerId: string) {
        //TODO Handle error - send something to client? or not bother with it at all?
        if (!validator.isURL(url))
            throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
    }

    hasAddedPhoto(photographerId: string) {
        return this.photos.has(photographerId);
    }

    getNumberPhotos(photographerId: string) {
        return this.photos.has(photographerId) ? this.photos.get(photographerId)!.length : 0;
    }
}
