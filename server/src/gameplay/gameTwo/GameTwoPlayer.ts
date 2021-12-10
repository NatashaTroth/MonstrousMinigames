import Player from "../Player";

import Parameters from "./constants/Parameters";
import { Direction } from "./enums/Direction";

class GameTwoPlayer extends Player {
    public direction: string;
    public moving: boolean;
    public posX: number;
    public posY: number;
    constructor(
        public id: string,
        name: string,
        private number: number,
        public killsLeft: number,
        public characterNumber: number
    ) {
        super(id, name, characterNumber);
        this.direction = 'C';
        this.moving = false;
        this.posX = this.getPlayerPositionX();
        this.posY = this.getPlayerPositionY();
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
    public setPlayerPosition(): void {
        this.posX = this.getPlayerPositionX();
        this.posY = this.getPlayerPositionY();
    }
    private getPlayerPositionX(): number {
        return Parameters.PLAYERS_POSITIONS[this.number].x;
    }

    private getPlayerPositionY(): number {
        return Parameters.PLAYERS_POSITIONS[this.number].y;
    }

    public setDirection(direction: string): void {
        this.direction = direction;
    }
    public setKillsLeft(killsLeft: number): void {
        this.killsLeft = killsLeft;
    }
}
export default GameTwoPlayer;
