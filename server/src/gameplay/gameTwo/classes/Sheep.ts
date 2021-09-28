import { SheepStates } from "../enums/SheepStates";

export default class Sheep {
    public posX: number;
    public posY: number;
    public state: string;

    constructor(posX: number, posY: number
    ) {
        this.posX = posX;
        this.posY = posY;
        this.state = SheepStates.ALIVE
    }
}
