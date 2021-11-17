import DI from '../../../di';
import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { IMessagePhoto, IMessagePhotoVote, UrlPhotographerMapper } from '../interfaces';
import { PhotoTopics } from './';
import { PhotoStage } from './PhotoStage';
import { PhotoInput } from './Stage';
import { VotingStage } from './VotingStage';

export class SinglePhotoStage extends PhotoStage {
    protected photos: Map<string, string>;
    private photoTopics: PhotoTopics;

    constructor(roomId: string, userIds: string[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_TAKE_PHOTO);
        this.photos = new Map<string, string>(); //key = photographerId, value = url
        this.photoTopics = new PhotoTopics();
        // super.entry();
        this.photoTopics.sendNextTopicToClient(roomId);
    }

    switchToNextStage() {
        const photoUrls: UrlPhotographerMapper[] = this.getPhotos() as UrlPhotographerMapper[];
        GameThreeEventEmitter.emitVoteForPhotos(this.roomId, photoUrls, InitialParameters.COUNTDOWN_TIME_VOTE);
        return new VotingStage(this.roomId, this.userIds);
    }

    protected addPhoto(photographerId: string, url: string) {
        if (!this.photos.has(photographerId)) {
            this.photos.set(photographerId, url);
        }
    }

    protected getPhotos(): UrlPhotographerMapper[] {
        const photosArray: UrlPhotographerMapper[] = [];
        this.photos.forEach((value, key) => photosArray.push({ photographerId: key, url: value }));
        return photosArray;
    }

    protected hasAddedPhoto(photographerId: string) {
        return this.photos.has(photographerId);
    }
}
