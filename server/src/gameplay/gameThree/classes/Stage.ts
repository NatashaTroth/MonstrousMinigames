// import validator from 'validator';

// import { InvalidUrlError } from '../customErrors';
// import { PhotoPhotographerMapper, PhotosPhotographerMapper } from '../interfaces';

export interface PhotoInput {
    photographerId: string;
    url: string;
}

export interface VotingInput {
    voterId: string;
    photographerId: string;
}

export interface Stage {
    handleInput(data: PhotoInput | VotingInput | undefined): void | Stage;

    entry(): void;

    //TODO make URL type
    // protected abstract photos: Map<string, string | string[]>;
    // abstract getPhotos(): PhotoPhotographerMapper[] | PhotosPhotographerMapper[];
    // getPhotoUrlsFromUser(photographerId: string): string[] {
    //     return this.photos.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    // }
    // abstract addPhoto(photographerId: string, url: string): void;
    // protected validateUrl(url: string, photographerId: string) {
    //     //TODO Handle error - send something to client? or not bother with it at all?
    //     if (!validator.isURL(url))
    //         throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
    // }
    // abstract havePhotosFromAllUsers(photographerIds: string[]): boolean;
    // hasAddedPhoto(photographerId: string) {
    //     return this.photos.has(photographerId);
    // }
    // abstract getNumberPhotos(photographerId?: string): number;
}
