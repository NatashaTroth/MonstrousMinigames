import Player from '../Player';

class GameThreePlayer extends Player {
    constructor(id: string, name: string) {
        super(id, name);
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {}
}
export default GameThreePlayer;
