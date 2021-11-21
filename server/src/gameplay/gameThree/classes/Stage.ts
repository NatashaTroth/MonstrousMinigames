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
    protected countdown = Countdown.getInstance();
    // protected abstract countdownTime: number;
    protected stageEventEmitter = StageEventEmitter.getInstance();

    abstract handleInput(message: IMessage): void;

    constructor(protected roomId: string, protected userIds: string[] = [], protected countdownTime: number) {
        // console.log('--- new stage --- ', this.constructor.name);
        this.initiateCountdown();
    }

    protected initiateCountdown() {
        this.countdown.initiateCountdown(this.countdownTime);
    }

    // protected stopCountdown(){

    // }

    abstract switchToNextStage(): Stage;
    // switchToNextStage(): Stage | void {
    //     this.countdown.resetCountdown();
    // }

    update(timeElapsedSinceLastFrame: number) {
        this.countdown.update(timeElapsedSinceLastFrame);
        if (this.countdown.countdownOver()) {
            //TODO
            // console.log('countdown over=========');
            // console.log(this.constructor.name);
            this.emitStageChangeEvent();
        }
    }

    emitStageChangeEvent() {
        this.countdown.resetCountdown();
        this.stageEventEmitter.emit(
            StageEventEmitter.STAGE_CHANGE_EVENT,
            'Emitter: This StageLL: ' + this.constructor.name
        );
    }

    hasNextStage(): boolean {
        return true;
    }
}
