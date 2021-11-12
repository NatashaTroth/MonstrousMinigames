import Player from '../Player';
import InitialParameters from './constants/InitialParameters';
import { FinalPhotos, Photo } from './interfaces';

class GameThreePlayer extends Player {
    private roundInfo: Photo[];
    private finalRoundInfo: FinalPhotos;
    private _totalPoints = 0;

    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);

        this.roundInfo = new Array(InitialParameters.NUMBER_ROUNDS - 1);
        for (let i = 0; i < this.roundInfo.length; i++) {
            this.roundInfo[i] = {
                // url: '',
                // received: false,
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

    // receivedPhoto(url: string, roundIdx: number) {
    //     if (this.roundInfo.length >= roundIdx + 1) this.roundInfo[roundIdx].url = url;
    //     this.roundInfo[roundIdx].received = true;
    // }

    // photoIsReceived(roundIdx: number) {
    //     return this.roundInfo[roundIdx].received;
    // }

    set totalPoints(points: number) {
        this._totalPoints += points;
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

    getRoundPoints(roundIdx: number) {
        return this.roundInfo[roundIdx].points;
    }

    getFinalPoints() {
        return this.finalRoundInfo.points;
    }

    removePoints(roundIdx: number) {
        //TODO
        // if (!this.roundInfo[roundIdx].voted || !this.roundInfo[roundIdx].received) {
        this.roundInfo[roundIdx].points = 0;
        // }
    }

    hasVoted(roundIdx: number) {
        return this.roundInfo[roundIdx].voted;
    }

    hasVotedFinal() {
        return this.finalRoundInfo.voted;
    }

    // hasReceivedPhoto(roundIdx: number) {
    //     return this.roundInfo[roundIdx].received;
    // }

    hasReceivedFinalPhotos() {
        return this.finalRoundInfo.received;
    }

    // getUrl(roundIdx: number) {
    //     return this.roundInfo[roundIdx].url;
    // }

    getFinalUrls() {
        return this.finalRoundInfo.urls;
    }

    voted(roundidx: number) {
        this.roundInfo[roundidx].voted = true;
    }

    votedFinal() {
        this.finalRoundInfo.voted = true;
    }
}
export default GameThreePlayer;
