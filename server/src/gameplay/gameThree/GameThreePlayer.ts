import Player from '../Player';

class GameThreePlayer extends Player {
    constructor(id: string, name: string, characterNumber: number) {
        super(id, name, characterNumber);
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        return;
    }
}
export default GameThreePlayer;
