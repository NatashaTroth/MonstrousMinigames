import { SheepStates } from "../enums/SheepStates";
import { Direction } from "../enums/Direction";
import Parameters from "../constants/Parameters";

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
        if (this.isMoving) {
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

    public startMoving(): void {
        this.cycleMoving();
    }

    public stopMoving(): boolean {
        if (this.interval) {
            clearInterval(this.interval)
            return true;
        }
        return false;
    }

    private move() {
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
}
