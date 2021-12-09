import Player from "../Player";

import Parameters from "./constants/Parameters";
import { Direction } from "./enums/Direction";

class GameTwoPlayer extends Player {
    public direction: string;
    public moving: boolean;
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
        this.moving = false;
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.moving) this.move();
    }
    public move() {
        if (this.direction === Direction.STOP) {
            return;
        }
        if (this.direction.startsWith(Direction.UP)) {
            if (this.posY > 0) {
                this.posY -= Parameters.SPEED;
            }
        }
        if (this.direction.startsWith(Direction.DOWN)) {
            if (this.posY < Parameters.LENGTH_Y) {
                this.posY += Parameters.SPEED;
            }
        }
        if (this.direction.includes(Direction.RIGHT)) {
            if (this.posX < Parameters.LENGTH_X) {
                this.posX += Parameters.SPEED;
            }
        }
        if (this.direction.includes(Direction.LEFT)) {
            if (this.posX > 0) {
                this.posX -= Parameters.SPEED;
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
