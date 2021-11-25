// import validator from 'validator';

import { IMessage } from '../../../interfaces/messages';
import { PlayerNameId } from '../interfaces';
import { Countdown } from './Countdown';
import { PlayerPoints } from './PlayerPoints';
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

    protected playerPoints: PlayerPoints;

    abstract handleInput(message: IMessage): void;

    constructor(protected roomId: string, protected players: PlayerNameId[] = [], protected countdownTime: number) {
        // console.log('--- new stage --- ', this.constructor.name);
        this.initiateCountdown();
        this.playerPoints = new PlayerPoints(players);
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
            // this.emitStageChangeEvent();
            this.countdownOver();
        }
    }

    updatePlayerPoints(): undefined | Map<string, number> {
        return undefined;
    }

    protected abstract countdownOver(): void;

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

    isFinalStage(): boolean {
        return false;
    }
}
