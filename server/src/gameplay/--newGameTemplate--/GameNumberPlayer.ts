import Player from '../Player';

class GameNumberPlayer extends Player {
    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        // do something
    }
}
export default GameNumberPlayer;
