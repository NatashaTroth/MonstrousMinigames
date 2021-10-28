import Player from '../Player';
import { Obstacle, PlayerState } from './interfaces';

class GameOnePlayer extends Player implements PlayerState {
    static readonly EVT_UNSTUNNED = 'unstunned';

    finishedTimeMs = 0;
    atObstacle = false;
    stonesCarrying = 0;
    dead = false;
    stunned = false;
    stunnedSeconds = 0;
    chaserPushesUsed = 0;

    constructor(
        id: string,
        name: string,
        public positionX: number,
        public obstacles: Obstacle[],
        public characterNumber: number
    ) {
        super(id, name);
    }

    async update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> {
        if (this.stunned) {
            this.stunnedSeconds -= timeElapsedSinceLastFrame;
            if (this.stunnedSeconds <= 0) {
                this.stunned = false;
                this.emit(GameOnePlayer.EVT_UNSTUNNED, this);
            }
        }
    }
}

export default GameOnePlayer;
