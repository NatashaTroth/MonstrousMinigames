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
    // handleInput(message: IMessage) {
    //     return;
    // }

    constructor(protected roomId: string, protected players: PlayerNameId[] = [], protected countdownTime: number) {
        this.initiateCountdown();
        this.playerPoints = new PlayerPoints(players);
    }

    protected initiateCountdown() {
        this.countdown.initiateCountdown(this.countdownTime);
    }

    abstract switchToNextStage(): Stage | null;

    update(timeElapsedSinceLastFrame: number) {
        this.countdown.update(timeElapsedSinceLastFrame);
        if (this.countdown.countdownOver()) {
            this.countdownOver();
        }
    }

    updatePlayerPoints(): undefined | Map<string, number> {
        return undefined;
    }

    protected abstract countdownOver(): void;

    emitStageChangeEvent() {
        this.countdown.resetCountdown();
        this.stageEventEmitter.emit(StageEventEmitter.STAGE_CHANGE_EVENT);
    }

    // hasNextStage(): boolean {
    //     return true;
    // }

    isFinalStage(): boolean {
        return false;
    }
}
