import GameOneEventEmitter from '../GameOneEventEmitter';
import * as InitialGameParameters from '../GameOneInitialParameters';

class Chasers {
    maxNumberOfChaserPushes = InitialGameParameters.MAX_NUMBER_CHASER_PUSHES;
    chaserPushAmount = InitialGameParameters.CHASER_PUSH_AMOUNT;
    chasersSpeed = InitialGameParameters.CHASERS_SPEED;
    chasersPositionX = InitialGameParameters.CHASERS_POSITION_X;

    constructor(private trackLength: number, private roomId: string) {}

    async update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> {
        this.updateChasersPosition(timeElapsedSinceLastFrame);
    }

    private updateChasersPosition(timeElapsedSinceLastFrame: number) {
        //10000 to 90000  * timePassed //TODO - make faster over time??
        if (this.chasersPositionX > this.trackLength) return;
        this.chasersPositionX += (timeElapsedSinceLastFrame / 33) * this.chasersSpeed;
    }

    getPosition() {
        return this.chasersPositionX;
    }

    push() {
        //TODO Test
        this.chasersPositionX += this.chaserPushAmount;
        this.chasersSpeed = InitialGameParameters.CHASERS_PUSH_SPEED;
        setTimeout(() => {
            this.chasersSpeed = InitialGameParameters.CHASERS_SPEED;
        }, 1300);

        GameOneEventEmitter.emitChasersWerePushed(this.roomId, this.chaserPushAmount);
    }
}

export default Chasers;
