import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { FinalPhotosVotingStage } from './FinalPhotoVotingStage';
import { PresentationController } from './PresentationController';
import { Stage } from './Stage';

export class PresentationStage extends Stage {
    private presentationController: PresentationController;

    constructor(roomId: string, players: PlayerNameId[], private photoUrls: string[]) {
        super(roomId, players, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);

        this.presentationController = new PresentationController(players, photoUrls);
        this.handleNewPresentationRound();
    }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.FINISHED_PRESENTING) return;
        this.handleNewPresentationRound();
    }

    switchToNextStage() {
        return new FinalPhotosVotingStage(this.roomId, this.players); //TODO change make voting stage parent..
    }

    protected countdownOver() {
        this.handleNewPresentationRound();
    }

    private handleNewPresentationRound() {
        if (this.presentationController.isAnotherPresenterAvailable()) {
            const nextPresenter = this.presentationController.nextPresenter();
            const photoUrls = this.presentationController.getNextPhotoUrls();
            // const photoUrls = this.presentationController.getPhotoUrlsFromUser(nextPresenterId);

            GameThreeEventEmitter.emitPresentFinalPhotosCountdown(
                this.roomId,
                InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS,
                nextPresenter,
                photoUrls
            );
            this.countdown.initiateCountdown(InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        } else {
            this.emitStageChangeEvent();
            // this.switchToFinalVotingStage();
        }
    }
}
