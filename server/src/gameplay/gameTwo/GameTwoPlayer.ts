import Player from "../Player";

import Parameters from "./constants/Parameters";
import { Direction } from "./enums/Direction";

class GameTwoPlayer extends Player {
    public direction: string;
    public moving: boolean;
    public speed: number;
    public posX: number;
    public posY: number;
    public chosenSheep: number | null;
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
        this.speed = Parameters.SPEED;
        this.posX = this.getPlayerPositionX();
        this.posY = this.getPlayerPositionY();
        this.chosenSheep = null;
    }

    update(timeElapsed: number, timeElapsedSinceLastFrame: number): void | Promise<void> {
        if (this.moving) this.move();
    }

    public move() {
        if (this.direction !== Direction.STOP) {
            switch (this.direction) {
                case Direction.UP_LEFT:
                    this.moveUp();
                    this.moveLeft();
                    break;
                case Direction.UP:
                    this.moveUp();
                    break;
                case Direction.UP_RIGHT:
                    this.moveUp();
                    this.moveRight();
                    break;
                case Direction.RIGHT:
                    this.moveRight();
                    break;
                case Direction.DOWN_RIGHT:
                    this.moveDown();
                    this.moveRight();
                    break;
                case Direction.DOWN:
                    this.moveDown();
                    break;
                case Direction.DOWN_LEFT:
                    this.moveDown();
                    this.moveLeft();
                    break;
                case Direction.LEFT:
                    this.moveLeft();
                    break;
            }
        }
    }
    private moveLeft(){
        if (this.posX - this.speed >= 0) {
            this.posX -= this.speed;
        }else{
            this.posX = 0;
        }
    }

    private moveRight(){
        if (this.posX + this.speed <= Parameters.LENGTH_X) {
            this.posX += this.speed;
        }else{
            this.posX = Parameters.LENGTH_X;
        }
    }

    private moveUp(){
        if (this.posY - this.speed >= 0) {
            this.posY -= this.speed;
        }else{
            this.posY = 0;
        }
    }

    private moveDown(){
        if (this.posY + this.speed <= Parameters.LENGTH_Y) {
            this.posY += this.speed;
        }else{
            this.posY = Parameters.LENGTH_Y
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
        this.chosenSheep = null;
    }
}
export default GameTwoPlayer;
