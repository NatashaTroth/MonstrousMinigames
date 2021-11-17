// import validator from 'validator';

import { IMessage } from '../../../interfaces/messages';
import { Countdown } from './';
import StageEventEmitter from './StageEventEmitter';

// import { InvalidUrlError } from '../customErrors';
// import { UrlPhotographerMapper, PhotosPhotographerMapper } from '../interfaces';

export interface PhotoInput {
    photographerId: string;
    url: string;
}

export interface VotingInput {
    voterId: string;
    photographerId: string;
}

export abstract class Stage {
    protected countdown = new Countdown();
    // protected abstract countdownTime: number;
    private stageEventEmitter = StageEventEmitter.getInstance();

    // abstract handleInput(data: PhotoInput | VotingInput | undefined): void | Stage;
    abstract handleInput(message: IMessage): void;

    constructor(protected roomId: string, protected userIds: string[] = [], protected countdownTime: number) {
        this.initiateCountdown();
    }

    protected initiateCountdown() {
        this.countdown.initiateCountdown(this.countdownTime);
    }

    abstract switchToNextStage(): Stage;

    update(timeElapsedSinceLastFrame: number) {
        this.countdown.update(timeElapsedSinceLastFrame);
        if (this.countdown.countdownOver()) {
            //TODO
            this.emitStageChangeEvent();
        }
    }

    emitStageChangeEvent() {
        this.stageEventEmitter.emit(StageEventEmitter.STAGE_CHANGE_EVENT);
    }

    //TODO make URL type
    // protected abstract photos: Map<string, string | string[]>;
    // abstract getPhotos(): UrlPhotographerMapper[] | PhotosPhotographerMapper[];
    // getPhotoUrlsFromUser(photographerId: string): string[] {
    //     return this.photos.has(photographerId) ? [...this.photos.get(photographerId)!] : [];
    // }
    // abstract addPhoto(photographerId: string, url: string): void;
    // protected validateUrl(url: string, photographerId: string) {
    //     //TODO Handle error - send something to client? or not bother with it at all?
    //     if (!validator.isURL(url))
    //         throw new InvalidUrlError('The received value for the URL is not valid.', photographerId);
    // }
    // abstract havePhotosFromAllUsers(photographerIds: string[]): boolean;
    // hasAddedPhoto(photographerId: string) {
    //     return this.photos.has(photographerId);
    // }
    // abstract getNumberPhotos(photographerId?: string): number;
}
