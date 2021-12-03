import random from 'random';
import Parameters from '../constants/Parameters';
import { SheepStates } from '../enums/SheepStates';
import GameTwoPlayer from '../GameTwoPlayer';
import Sheep from "./Sheep";


export default class SheepService {
    public sheep: Sheep[];
    private currentSheepId: number;
    private sheepCount: number;

    constructor(sheepCount: number) {
        this.sheep = [];
        this.currentSheepId = 0;
        this.sheepCount = sheepCount;
    }

    public initSheep(): void {
        const seedrandom = require('seedrandom');
        random.use(seedrandom('sheep'));

        for (let i = 0; i < this.sheepCount; i++) {
            let posX: number;
            let posY: number;
            do {
                posX = random.int(Parameters.MARGIN, Parameters.LENGTH_X - Parameters.MARGIN);
                posY = random.int(Parameters.MARGIN, Parameters.LENGTH_Y - Parameters.MARGIN);
            } while (!this.isValidStartingPosition(posX, posY));
            this.sheep.push(new Sheep(posX, posY, this.currentSheepId));
            this.currentSheepId++;
        }
    }
    protected isValidStartingPosition(posX: number, posY: number): boolean {
        let valid = true;

        Parameters.PLAYERS_POSITIONS.forEach(player => {
            if (
                Math.abs(player.x - posX) < Parameters.MARGIN ||
                Math.abs(player.y - posY) < Parameters.MARGIN
            ) {
                valid = false;
                return;
            }
        });
        this.sheep.forEach(sheep => {
            if (
                Math.abs(sheep.posX - posX) < Parameters.MARGIN &&
                Math.abs(sheep.posY - posY) < Parameters.MARGIN
            ) {
                valid = false;
                return;
            }
        });

        return valid;
    }
    public update(): void {
        const aliveSheep = this.sheep.filter(s => s.state === SheepStates.ALIVE);
        aliveSheep.forEach(sheep => {
            sheep.update();
        });
    }

    public startMoving(): void {
        const aliveSheep = this.sheep.filter(s => s.state === SheepStates.ALIVE);
        aliveSheep.forEach(sheep => {
            sheep.startMoving();
        });
    }

    public stopMoving(): void {
        const aliveSheep = this.sheep.filter(s => s.state === SheepStates.ALIVE);
        aliveSheep.forEach(sheep => {
            sheep.stopMoving();
        });
    }

    private getSheepInRadius(player: GameTwoPlayer): Sheep[] {
        return this.sheep.filter(sheep => {
            return (
                sheep.state === SheepStates.ALIVE &&
                Math.abs(sheep.posX - player.posX) <= Parameters.KILL_RADIUS &&
                Math.abs(sheep.posY - player.posY) <= Parameters.KILL_RADIUS
            );
        });
    }

    private getClosestSheepId(player: GameTwoPlayer, sheepInRadius: Sheep[]): number {
        let sheepId = sheepInRadius[0].id;
        let minDistance = 1 + Parameters.KILL_RADIUS * 2;
        let currentDistance;
        sheepInRadius.forEach(sheep => {
            currentDistance = Math.abs(sheep.posX - player.posX) + Math.abs(sheep.posY - player.posY);
            if (currentDistance < minDistance) {
                minDistance = currentDistance;
                sheepId = sheep.id;
            }
        });
        return sheepId;
    }
    public killSheep(player: GameTwoPlayer): boolean {
        const sheepInRadius = this.getSheepInRadius(player);

        if (sheepInRadius.length < 1) return false;

        let sheepId;
        if (sheepInRadius.length === 1) {
            sheepId = sheepInRadius[0].id;
        } else {
            sheepId = this.getClosestSheepId(player, sheepInRadius);
        }
        this.sheep[sheepId].state = SheepStates.DECOY;
        this.sheep[sheepId].stopMoving();
        return true;

    }

    public getAliveSheepCount(): number {
        return this.sheep.filter(s => s.state === SheepStates.ALIVE).length;
    }
}
