import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { Photo } from './interfaces';
import { FinalPhotos } from './interfaces/FinalPhotos';

class GameThreePlayer extends Player {
    roundInfo: Photo[];
    finalRoundInfo: FinalPhotos;

    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);

        this.roundInfo = new Array(InitialParameters.NUMBER_ROUNDS - 1);
        for (let i = 0; i < this.roundInfo.length; i++) {
            this.roundInfo[i] = {
                url: '',
                received: false,
                points: 0,
                voted: false,
            };
        }

        this.finalRoundInfo = {
            urls: [],
            received: false,
            points: 0,
            voted: false,
        };
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // do something
    }

    receivedPhoto(url: string, roundIdx: number) {
        if (this.roundInfo.length >= roundIdx + 1) this.roundInfo[roundIdx].url = url;
        this.roundInfo[roundIdx].received = true;
    }

    photoIsReceived(roundIdx: number) {
        return this.roundInfo[roundIdx].received;
    }

    receivedFinalPhoto(url: string) {
        // if (this.roundInfo.length >= roundIdx + 1) this.roundInfo[roundIdx].url = url;
        // this.roundInfo[roundIdx].received = true;
        this.finalRoundInfo.urls.push(url);
        if (this.finalRoundInfo.urls.length >= InitialParameters.NUMBER_FINAL_PHOTOS) {
            this.finalRoundInfo.received = true;
        }
    }

    finalPhotosAreReceived() {
        return this.finalRoundInfo.received;
    }

    addPoints(roundIdx: number, points: number) {
        this.roundInfo[roundIdx].points += points;
    }

    addPointsFinalRound(points: number) {
        this.finalRoundInfo.points += points;
    }

    getTotalPoints() {
        return (
            this.roundInfo.reduce((result, item) => {
                return result + item.points;
            }, 0) + this.finalRoundInfo.points
        );
    }
}
export default GameThreePlayer;
