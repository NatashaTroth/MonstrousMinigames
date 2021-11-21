import { shuffleArray } from '../../../helpers/shuffleArray';
import { IMessage } from '../../../interfaces/messages';
import { PhotosPhotographerMapper } from '../interfaces';

export class PresentationController {
    private playerPresentOrder: string[] = [];

    constructor(playerIds: string[], private photoUrls: PhotosPhotographerMapper[]) {
        this.playerPresentOrder = shuffleArray(playerIds);

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

    nextPresenter() {
        const presenter = this.playerPresentOrder.shift();
        if (presenter) return presenter!;
        throw new Error('No presenter left'); //TODO handle
    }

    isAnotherPresenterAvailable() {
        return this.playerPresentOrder.length > 0;
    }

    getPhotoUrlsFromUser(photographerId: string): string[] {
        const photographerPhotos = this.photoUrls.filter(
            photographer => photographer.photographerId === photographerId
        );
        // if(photographerPhotos.length === 0) return []

        // photographerPhotos!

        return photographerPhotos && photographerPhotos.length > 0 ? [...photographerPhotos[0].urls!] : [];
        // return this.photoUrls.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    }
}
