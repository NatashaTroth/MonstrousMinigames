// import InitialParameters from '../constants/InitialParameters';
// import { GameThreeGameState } from '../enums/GameState';
// import GameThreeEventEmitter from '../GameThreeEventEmitter';
// import GameThreePlayer from '../GameThreePlayer';
import { photoPhotographerMapper } from '../interfaces';

// interface RoundPhoto {
//     url: string;
//     received: boolean;
// }

// interface FinalRoundPhotos{
//   url: string[],
//   // received: boolean
// }

export class PhotoStage {
    //TODO make URL type
    private photos: Map<string, string>;

    constructor() {
        this.photos = new Map<string, string>(); //key = playerId, value = url
    }

    // *** Taking Photos ***

    getPhotos(): photoPhotographerMapper[] {
        const photosArray: photoPhotographerMapper[] = [];
        this.photos.forEach((key, value) => photosArray.push({ photographerId: key, url: value }));
        return photosArray;
    }
}
