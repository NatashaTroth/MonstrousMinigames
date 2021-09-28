import Player from "../Player";

class GameTwoPlayer extends Player {
    constructor(
        id: string,
        name: string,
        public posX: number,
        public posY: number,
        public characterNumber: number
    ){
        super(id, name);
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}
export default GameTwoPlayer;
