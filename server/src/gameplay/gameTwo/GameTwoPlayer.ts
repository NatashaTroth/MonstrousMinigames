import Player from "../Player";
import Parameters from "./constants/Parameters";
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
        this.speed = Parameters.SPEED;
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        this.move();
    }
    public move() {
        if (this.direction === Direction.STOP) {
            return;
        }
        if (this.direction.startsWith(Direction.UP)) {
            if (this.posY > 0) {
                this.posY -= this.speed;
            }
        }
        if (this.direction.startsWith(Direction.DOWN)) {
            if (this.posY < Parameters.LENGTH_Y) {
                this.posY += this.speed;
            }
        }
        if (this.direction.includes(Direction.RIGHT)) {
            if (this.posX < Parameters.LENGTH_X) {
                this.posX += this.speed;
            }
        }
        if (this.direction.includes(Direction.LEFT)) {
            if (this.posX > 0) {
                this.posX -= this.speed;
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
