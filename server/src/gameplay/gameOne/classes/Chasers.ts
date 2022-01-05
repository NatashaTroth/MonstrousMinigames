import InitialParameters from '../constants/InitialParameters';
import GameOneEventEmitter from '../GameOneEventEmitter';

class Chasers {
    maxNumberOfChaserPushes = InitialParameters.MAX_NUMBER_CHASER_PUSHES;
    chaserPushAmount = InitialParameters.CHASER_PUSH_AMOUNT;
    chasersSpeed = InitialParameters.CHASERS_SPEED;
    chasersPositionX = InitialParameters.CHASERS_POSITION_X;

    constructor(private trackLength: number, private roomId: string) {}

    async update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> {
        this.updateChasersPosition(timeElapsedSinceLastFrame);
        // console.log('chaser update' + this.chasersPositionX);
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
        this.chasersSpeed = InitialParameters.CHASERS_PUSH_SPEED;
        setTimeout(() => {
            this.chasersSpeed = InitialParameters.CHASERS_SPEED;
        }, 1300);

        GameOneEventEmitter.emitChasersWerePushed(this.roomId, this.chaserPushAmount);
    }
}

export default Chasers;
