import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { Photo } from './interfaces';

class GameThreePlayer extends Player {
    photos: Photo[];
    private totalPoints: number;

    constructor(id: string, name: string) {
        super(id, name);
        this.photos = new Array(InitialParameters.NUMBER_PHOTO_TOPICS).fill({ url: '', received: false, points: 0 });
        this.totalPoints = 0;
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // do something
    }

    receivedPhoto(url: string, roundIdx: number) {
        if (this.photos.length >= roundIdx + 1) this.photos[roundIdx].url = url;
        this.photos[roundIdx].received = true;
    }

    addPoints(roundIdx: number, points: number) {
        this.photos[roundIdx].points = points;
        this.totalPoints += points;
    }

    getTotalPoints() {
        return this.totalPoints;
    }
}
export default GameThreePlayer;
