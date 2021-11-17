// import validator from 'validator';

import { IMessage } from '../../../interfaces/messages';
import { Countdown } from './Countdown';
import StageEventEmitter from './StageEventEmitter';

// export interface PhotoInput {
//     photographerId: string;
//     url: string;
// }

// export interface VotingInput {
//     voterId: string;
//     photographerId: string;
// }

export abstract class Stage {
    protected countdown = new Countdown();
    // protected abstract countdownTime: number;
    private stageEventEmitter = StageEventEmitter.getInstance();

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
}
