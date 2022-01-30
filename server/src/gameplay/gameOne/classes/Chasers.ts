import GameOneEventEmitter from '../GameOneEventEmitter';
import { InitialParams } from '../GameOneInitialParameters';

class Chasers {
    maxNumberOfChaserPushes: number;
    chaserPushAmount: number;
    chasersSpeed: number;
    chasersPositionX: number;

    constructor(private trackLength: number, private roomId: string, private InitialParameters: InitialParams) {
        this.maxNumberOfChaserPushes = this.InitialParameters.MAX_NUMBER_CHASER_PUSHES;
        this.chaserPushAmount = this.InitialParameters.CHASER_PUSH_AMOUNT;
        this.chasersSpeed = this.InitialParameters.CHASERS_SPEED;
        this.chasersPositionX = this.InitialParameters.CHASERS_POSITION_X;
    }

    async update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> {
        this.updateChasersPosition(timeElapsedSinceLastFrame);
    }

    private updateChasersPosition(timeElapsedSinceLastFrame: number) {
        if (this.chasersPositionX > this.trackLength) return;
        this.chasersPositionX += (timeElapsedSinceLastFrame / 33) * this.chasersSpeed;
    }

    getPosition() {
        return this.chasersPositionX;
    }

    push() {
        this.chasersPositionX += this.chaserPushAmount;
        this.chasersSpeed = this.InitialParameters.CHASERS_PUSH_SPEED;
        setTimeout(() => {
            this.chasersSpeed = this.InitialParameters.CHASERS_SPEED;
        }, 1300);

        GameOneEventEmitter.emitChasersWerePushed(this.roomId, this.chaserPushAmount);
    }
}

export default Chasers;
