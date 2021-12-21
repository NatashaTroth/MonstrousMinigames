import Player from "../Player";

import Parameters from "./constants/Parameters";
import { Direction } from "./enums/Direction";

class GameTwoPlayer extends Player {
    public direction: string;
    public moving: boolean;
    public sneaking: boolean;
    public speed: number;
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
        this.sneaking = false;
        this.speed = this.getSpeed();
        this.posX = this.getPlayerPositionX();
        this.posY = this.getPlayerPositionY();
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.moving) this.move();
    }

    public move() {
        // if (this.direction === Direction.STOP) {
        //     return;
        // }
        // if (this.direction.startsWith(Direction.UP)) {
        //     if (this.posY - this.speed >= 0) {
        //         this.posY -= this.speed;
        //     }
        // }
        // if (this.direction.startsWith(Direction.DOWN)) {
        //     if (this.posY + this.speed <= Parameters.LENGTH_Y) {
        //         this.posY += this.speed;
        //     }
        // }
        // if (this.direction.includes(Direction.RIGHT)) {
        //     if (this.posX + this.speed <= Parameters.LENGTH_X) {
        //         this.posX += this.speed;
        //     }
        // }
        // if (this.direction.includes(Direction.LEFT)) {
        //     if (this.posX - this.speed >= 0) {
        //         this.posX -= this.speed;
        //     }
        // }

        if (this.direction !== Direction.STOP) {
            switch (this.direction) {
                case Direction.UP_LEFT:
                    if (this.posY - this.speed / 2 >= 0 && this.posX - this.speed / 2 >= 0) {
                        this.posY -= this.speed;
                        this.posX -= this.speed;
                    }
                    break;
                case Direction.UP:
                    if (this.posY - this.speed >= 0) {
                        this.posY -= this.speed;
                    }
                    break;
                case Direction.UP_RIGHT:
                    if (this.posY - this.speed / 2 >= 0 && this.posX + this.speed / 2 <+ Parameters.LENGTH_X) {
                        this.posY -= this.speed;
                        this.posX += this.speed;
                    }
                    break;
                case Direction.RIGHT:
                    if (this.posX + this.speed <= Parameters.LENGTH_X) {
                        this.posX += this.speed;
                    }
                    break;
                case Direction.DOWN_RIGHT:
                    if (this.posY + this.speed / 2 <= Parameters.LENGTH_Y && this.posX + this.speed / 2 <= Parameters.LENGTH_X) {
                        this.posY += this.speed;
                        this.posX += this.speed;
                    }
                    break;
                case Direction.DOWN:
                    if (this.posY + this.speed <= Parameters.LENGTH_Y) {
                        this.posY += this.speed;
                    }
                    break;
                case Direction.DOWN_LEFT:
                    if (this.posY + this.speed / 2 <= Parameters.LENGTH_Y && this.posX - this.speed / 2 >= 0) {
                        this.posY += this.speed;
                        this.posX -= this.speed;
                    }
                    break;
                case Direction.LEFT:
                    if (this.posX - this.speed >= 0) {
                        this.posX -= this.speed;
                    }
                    break;
            }
        }
    }
    public setPlayerPosition(): void {
        this.posX = this.getPlayerPositionX();
        this.posY = this.getPlayerPositionY();
    }
    private getPlayerPositionX(): number {
        return Parameters.PLAYERS_POSITIONS[this.number - 1].x;
    }

    private getPlayerPositionY(): number {
        return Parameters.PLAYERS_POSITIONS[this.number - 1].y;
    }
    private getSpeed(): number {
        if (this.sneaking) {
            return Parameters.SNEAKING_SPEED;
        } else {
            return Parameters.SPEED;
        }
    }

    public setSneaking(sneaking: boolean): void {
        this.sneaking = sneaking;
        this.speed = this.getSpeed();
    }

    public setDirection(direction: string): void {
        this.direction = direction;
    }
    public setKillsLeft(killsLeft: number): void {
        this.killsLeft = killsLeft;
    }

    public resetPlayer(): void {
        this.setPlayerPosition()
        this.setDirection(Direction.STOP);
        this.setKillsLeft(Parameters.KILLS_PER_ROUND);
    }
}
export default GameTwoPlayer;
