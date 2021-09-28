import Player from "../Player";

class GameTwoPlayer extends Player {
    public direction: string;
    constructor(
        id: string,
        name: string,
        public posX: number,
        public posY: number,
        public killsLeft: number,
        public characterNumber: number,
    ) {
        super(id, name);
        this.direction = 'C'
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        switch (this.direction) {
            case 'C':
                break;
            case 'N':
                this.posY -= 1;
                break;
            case 'E':
                this.posX += 1;
                break;
            case 'S':
                this.posY += 1;
                break;
            case 'W':
                this.posX -= 1;
                break;
        }
    }

    public setDirection(direction: string) {
        this.direction = direction;
    }

}
export default GameTwoPlayer;
