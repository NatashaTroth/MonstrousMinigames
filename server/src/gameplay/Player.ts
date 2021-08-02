import EventEmitter from 'events';
import { IPlayerState } from './interfaces';

abstract class Player extends EventEmitter implements IPlayerState {
    finished = false;
    rank = 0;
    isActive = true;

    constructor(public id: string, public name: string) {
        super();
    }

    abstract update(timeElapsed: number, timeElapsedSinceLastFrame: number): Promise<void> | void;
}

export default Player;
