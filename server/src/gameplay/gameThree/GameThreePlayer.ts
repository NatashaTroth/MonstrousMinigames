import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { Photo } from './interfaces';

class GameThreePlayer extends Player {
    roundInfo: Photo[];
    // private totalPoints: number;

    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);
        this.roundInfo = new Array(InitialParameters.NUMBER_ROUNDS).fill({
            url: '',
            received: false,
            points: 0,
            voted: false,
        });
        // this.totalPoints = 0;
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
        // this.totalPoints += points;
    }

    getTotalPoints() {
        // return this.totalPoints;
        let totalPoints = 0;
        this.roundInfo.forEach(round => (totalPoints += round.points));
        return totalPoints;
    }
}
export default GameThreePlayer;
