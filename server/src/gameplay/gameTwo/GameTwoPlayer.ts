import Player from "../Player";
import InitialParameters from "./constants/InitialParameters";
import { Direction } from "./enums/Direction";

class GameTwoPlayer extends Player {
    public direction: string;
    public speed: number;
    constructor(
        public id: string,
        name: string,
        public posX: number,
        public posY: number,
        public killsLeft: number,
        public characterNumber: number
    ) {
        super(id, name, characterNumber);
        this.direction = 'C';
        this.speed = 0; // Bitte ändern wenn es nicht passt sonst löschen
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.direction !== Direction.STOP) {
            switch (this.direction) {
                case Direction.UP:
                    if (this.posY > 0) {
                        this.posY -= this.speed;
                    }
                    break;
                case Direction.RIGHT:
                    if (this.posX < InitialParameters.LENGTH_X) {
                        this.posX += this.speed;
                    }
                    break;
                case Direction.DOWN:
                    if (this.posY < InitialParameters.LENGTH_Y) {
                        this.posY += this.speed;
                    }
                    break;
                case Direction.LEFT:
                    if (this.posX > 0) {
                        this.posX -= this.speed;
                    }
                    break;
            }
        }
    }

    public setDirection(direction: string) {
        this.direction = direction;
    }
    public setKillsLeft(killsLeft: number) {
        this.killsLeft = killsLeft;
    }
}
export default GameTwoPlayer;
