// import { PhotosPhotographerMapper } from '../interfaces';
// import { PhotoStage } from './PhotoStage';
// import { PhotoInput } from './Stage';

// export class MultiplePhotosStage extends PhotoStage {
//     protected photos: Map<string, string[]>;

//     constructor(private maxNumberPhotos: number) {
//         super();
//         this.photos = new Map<string, string[]>(); //key = photographerId, value = url
//     }

//     entry(roomId: string) {
//         //TODO
//     }

//     getPhotos(): PhotosPhotographerMapper[] {
//         const photosArray: PhotosPhotographerMapper[] = [];
//         this.photos.forEach((value, key) => photosArray.push({ photographerId: key, urls: value }));
//         return photosArray;
//     }

//     handleInput(data: PhotoInput) {
//         this.validateUrl(data.url, data.photographerId);

//         if (!this.photos.has(data.photographerId)) {
//             this.photos.set(data.photographerId, [data.url]);
//         } else {
//             const urls = this.photos.get(data.photographerId)!;
//             if (urls.length < this.maxNumberPhotos) this.photos.set(data.photographerId, [...urls, data.url]);
//             //TODO control
//         }
//     }

//     havePhotosFromAllUsers(photographerIds: string[]) {
//         return photographerIds.every(photographerId => {
//             return this.photos.has(photographerId) && this.photos.get(photographerId)!.length === this.maxNumberPhotos;
//         });
//     }

//     getNumberPhotos(photographerId: string) {
//         return this.photos.has(photographerId) ? this.photos.get(photographerId)!.length : 0;
//     }
// }
