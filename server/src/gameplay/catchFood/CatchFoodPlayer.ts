import Player from "../Player";
import { Obstacle, PlayerState } from "./interfaces";

class CatchFoodPlayer extends Player implements PlayerState {
    static readonly EVT_UNSTUNNED = 'unstunned';

    finishedTimeMs = 0;
    atObstacle = false;
    dead = false;
    stunned = false;
    stunnedSeconds = 0;
    numberStonesThrown = 0;

    constructor(
        id: string,
        name: string,
        public positionX: number,
        public obstacles: Obstacle[],
        public characterNumber: number,
    ) {
        super(id, name);
    }

    async update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> {
        if (this.stunned) {
            this.stunnedSeconds -= timeElapsedSinceLastFrame;
            if (this.stunnedSeconds <= 0) {
                this.stunned = false;
                this.emit(CatchFoodPlayer.EVT_UNSTUNNED, this);
            }
        }
    }
}

export default CatchFoodPlayer;
