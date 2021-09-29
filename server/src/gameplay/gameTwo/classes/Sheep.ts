import { SheepStates } from "../enums/SheepStates";

export default class Sheep {
    public posX: number;
    public posY: number;
    public state: string;
    public id: number;


    constructor(posX: number, posY: number, id: number
    ) {
        this.posX = posX;
        this.posY = posY;
        this.id = id;
        this.state = SheepStates.ALIVE
    }
}
