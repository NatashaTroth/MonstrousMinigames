import { SheepData } from "../interfaces";
import Parameters from "../constants/Parameters";
import { Direction } from "../enums/Direction";
import { SheepStates } from "../enums/SheepStates";

const SHEEP_DIRECTIONS: string[] = [Direction.UP, Direction.UP_RIGHT, Direction.RIGHT, Direction.DOWN_RIGHT, Direction.DOWN, Direction.DOWN_LEFT, Direction.LEFT, Direction.UP_LEFT];
export default class Sheep {
    public posX: number;
    public posY: number;
    public state: string;
    public id: number;
    public direction: string;
    public directions: string[];
    public speed: number;
    public isMoving: boolean;
    private interval: NodeJS.Timer | null;


    constructor(posX: number, posY: number, id: number
    ) {
        this.posX = posX;
        this.posY = posY;
        this.id = id;
        this.state = SheepStates.ALIVE;
        this.speed = Parameters.SPEED;
        this.directions = this.initDirections();
        this.direction = '';
        this.isMoving = false;
        this.interval = null;
    }

    private initDirections(): string[] {
        return [...new Array(Parameters.SHEEP_DIRECTIONS_COUNT)].map(() => SHEEP_DIRECTIONS[Math.round(Math.random() * (SHEEP_DIRECTIONS.length - 1))]);
    }

    public setNewDirection(): void {
        const currentDirection = this.directions.shift();
        if (currentDirection) {
            this.direction = currentDirection;
        } else {
            this.directions = this.initDirections();
            this.setNewDirection();
        }
    }

    public getTimeoutLength(): number {
        return Math.round(Math.random() * (Parameters.SHEEP_FREEZE_MAX_MS - Parameters.SHEEP_FREEZE_MIN_MS)) + Parameters.SHEEP_FREEZE_MIN_MS
    }

    public update(): void {
        if (this.isMoving && this.state === SheepStates.ALIVE) {
            this.move();
        }
    }
    private cycleMoving() {
        this.interval = setInterval(() => {
            this.setNewDirection();
            this.isMoving = true;
            setTimeout(() => {
                this.isMoving = false;
            }, this.getTimeoutLength());
        }, this.getTimeoutLength());
    }

    public startMoving(): boolean {
        if (this.state === SheepStates.ALIVE) {
            this.cycleMoving();
            return true;
        }
        return false;
    }

    public stopMoving(): boolean {
        if (this.interval) {
            clearInterval(this.interval)
            return true;
        }
        return false;
    }

    private move() {
        switch (this.direction) {
            case Direction.UP_LEFT:
                if (this.posY - this.speed / 2 >= 0 && this.posX - this.speed / 2 >= 0) {
                    this.posY -= this.speed;
                    this.posX -= this.speed;
                } else {
                    this.setNewDirection();
                }
                break;
            case Direction.UP:
                if (this.posY - this.speed >= 0) {
                    this.posY -= this.speed;
                } else {
                    this.setNewDirection();
                } break;
            case Direction.UP_RIGHT:
                if (this.posY - this.speed / 2 >= 0 && this.posX + this.speed / 2 < + Parameters.LENGTH_X) {
                    this.posY -= this.speed;
                    this.posX += this.speed;
                } else {
                    this.setNewDirection();
                }
                break;
            case Direction.RIGHT:
                if (this.posX + this.speed <= Parameters.LENGTH_X) {
                    this.posX += this.speed;
                } else {
                    this.setNewDirection();
                } break;
            case Direction.DOWN_RIGHT:
                if (this.posY + this.speed / 2 <= Parameters.LENGTH_Y && this.posX + this.speed / 2 <= Parameters.LENGTH_X) {
                    this.posY += this.speed;
                    this.posX += this.speed;
                } else {
                    this.setNewDirection();
                }
                break;
            case Direction.DOWN:
                if (this.posY + this.speed <= Parameters.LENGTH_Y) {
                    this.posY += this.speed;
                } else {
                    this.setNewDirection();
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
                } else {
                    this.setNewDirection();
                }
                break;
        }
    }

    public getData(): SheepData {
        return {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            state: this.state
        }
    }
}
