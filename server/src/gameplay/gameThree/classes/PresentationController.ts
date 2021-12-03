import { shuffleArray } from '../../../helpers/shuffleArray';
import InitialParameters from '../constants/InitialParameters';
import { PlayerNameId } from '../interfaces';

export class PresentationController {
    private playerPresentOrder: PlayerNameId[] = [];
    private photoUrlsShuffled: string[];

    constructor(players: PlayerNameId[], private photoUrls: string[]) {
        this.playerPresentOrder = shuffleArray(players);
        this.photoUrlsShuffled = shuffleArray(photoUrls);
    }

    nextPresenter(): PlayerNameId {
        const presenter = this.playerPresentOrder.shift();
        return presenter!; //check happens in class calling this
    }

    isAnotherPresenterAvailable() {
        return this.playerPresentOrder.length > 0;
    }

    getNextPhotoUrls(): string[] {
        const urls: string[] = [];
        let i = 0;
        while (i < InitialParameters.NUMBER_FINAL_PHOTOS) {
            if (this.photoUrlsShuffled.length === 0) this.photoUrlsShuffled = shuffleArray(this.photoUrls);
            const url = this.photoUrlsShuffled.shift();
            if (url) urls.push(url);
            else return []; //because this.photoUrls must be empty

            i++;
        }
        return urls;
    }
}
