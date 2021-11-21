import { IMessage } from '../../../interfaces/messages';
import InitialParameters from '../constants/InitialParameters';
import { GameThreeMessageTypes } from '../enums/GameThreeMessageTypes';
import GameThreeEventEmitter from '../GameThreeEventEmitter';
import { PlayerNameId } from '../interfaces';
import { MultiplePhotosVotingStage } from './MultiplePhotoVotingStage';
import { PresentationController } from './PresentationController';
import { Stage } from './Stage';

export class PresentationStage extends Stage {
    private presentationController: PresentationController;

    constructor(roomId: string, players: PlayerNameId[], private photoUrls: string[]) {
        super(roomId, players, InitialParameters.COUNTDOWN_TIME_PRESENT_PHOTOS);
        console.log('????????');

        this.presentationController = new PresentationController(players, photoUrls);
        this.handleNewPresentationRound();
    }

    handleInput(message: IMessage) {
        if (message.type !== GameThreeMessageTypes.FINISHED_PRESENTING) return;
        this.handleNewPresentationRound();
    }

    switchToNextStage() {
        console.log('Switch new stage');
        return new MultiplePhotosVotingStage(this.roomId, this.players, []); //TODO change make voting stage parent..
    }

    protected countdownOver() {
        this.handleNewPresentationRound();
    }

    private handleNewPresentationRound() {
        console.log('NEW presentation');
        if (this.presentationController.isAnotherPresenterAvailable()) {
            console.log('---');
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
