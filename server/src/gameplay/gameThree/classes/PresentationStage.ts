import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PhotosPhotographerMapper } from '../interfaces';
import { PresentationController } from './PresentationController';
import { Stage } from './Stage';
import StageEventEmitter from './StageEventEmitter';

export class PresentationStage extends Stage {
    private presentationController: PresentationController;

    constructor(roomId: string, userIds: string[], photoUrls: PhotosPhotographerMapper[]) {
        super(roomId, userIds, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);

        this.presentationController = new PresentationController(userIds, photoUrls);
        this.handleNewPresentationRound();
    }

    handleInput(message: IMessage) {
        return;
    }

    switchToNextStage() {
        this.stageEventEmitter.emit(StageEventEmitter.NEW_ROUND_EVENT);
        return this; //TODO change
    }

    private handleNewPresentationRound() {
        if (this.presentationController.isAnotherPresenterAvailable()) {
            const nextPresenterId = this.presentationController.nextPresenter();
            const photoUrls = this.presentationController.getPhotoUrlsFromUser(nextPresenterId);

            GameThreeEventEmitter.emitPresentFinalPhotosCountdown(
                this.roomId,
                InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS,
                nextPresenterId,
                'this.players.get(nextPresenterId)!.name', //TODO
                photoUrls
            );
            this.countdown.initiateCountdown(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        } else {
            // this.switchToFinalVotingStage();
        }
    }
}
