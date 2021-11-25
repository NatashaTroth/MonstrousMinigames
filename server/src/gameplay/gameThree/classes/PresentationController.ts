import { shuffleArray } from '../../../helpers/shuffleArray';
import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { PlayerNameId } from '../interfaces';

export class PresentationController {
    private playerPresentOrder: PlayerNameId[] = [];
    private photoUrlsShuffled: string[];

    constructor(players: PlayerNameId[], private photoUrls: string[]) {
        this.playerPresentOrder = shuffleArray(players);
        this.photoUrlsShuffled = shuffleArray(photoUrls);
        //TODO what if photoUrls = empty????  - cannot let it get to here

        //TODO
        // this.playerPresentOrder = shuffleArray(
        //     // players.filter(player => player.finalRoundInfo.received).map(player => player.id)
        // );
    }

    entry() {
        //TODO
    }

    //TODO change not undefined
    handleInput(message: IMessage) {
        //TODO change stage
    }

    nextPresenter(): PlayerNameId {
        const presenter = this.playerPresentOrder.shift();
        if (presenter) return presenter;
        throw new Error('No presenter left'); //TODO handle
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
        // return photographerPhotos && photographerPhotos.length > 0 ? [...photographerPhotos[0].urls!] : [];
        // return this.photoUrls.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    }
    // getPhotoUrlsFromUser(photographerId: string): string[] {
    //     const photographerPhotos = this.photoUrls.filter(
    //         photographer => photographer.photographerId === photographerId
    //     );
    //     return photographerPhotos && photographerPhotos.length > 0 ? [...photographerPhotos[0].urls!] : [];
    // }
}
