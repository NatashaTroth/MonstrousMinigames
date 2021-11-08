import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { Photo } from './interfaces';

class GameThreePlayer extends Player {
    roundInfo: Photo[];

    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);

        this.roundInfo = new Array(InitialParameters.NUMBER_ROUNDS);
        for (let i = 0; i < this.roundInfo.length; i++) {
            this.roundInfo[i] = {
                url: '',
                received: false,
                points: 0,
                voted: false,
            };
        }
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // do something
    }

    receivedPhoto(url: string, roundIdx: number) {
        if (this.roundInfo.length >= roundIdx + 1) this.roundInfo[roundIdx].url = url;
        this.roundInfo[roundIdx].received = true;
    }

    addPoints(roundIdx: number, points: number) {
        this.roundInfo[roundIdx].points = points;
    }

    getTotalPoints() {
        return this.roundInfo.reduce((result, item) => {
            return result + item.points;
        }, 0);
    }
}
export default GameThreePlayer;
