import Player from '../Player';

class GameNumberPlayer extends Player {
    constructor(id: string, name: string) {
        super(id, name);
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // do something
    }
}
export default GameNumberPlayer;
