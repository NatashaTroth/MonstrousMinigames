import random from 'random';

import GameTwoPlayer from '../GameTwoPlayer';
import { SheepData } from '../interfaces';
import Parameters from '../constants/Parameters';
import { SheepStates } from '../enums/SheepStates';

import Sheep from "./Sheep";


export default class SheepService {
    public sheep: Sheep[];
    private currentSheepId: number;
    private sheepCount: number;

    constructor(minSheepCount: number, maxSheepCount: number) {
        this.sheep = [];
        this.currentSheepId = 0;
        this.sheepCount = Math.round(Math.random() * (maxSheepCount - minSheepCount)) + minSheepCount;
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

    public chooseSheep(player: GameTwoPlayer): boolean {
        const sheepInRadius = this.getSheepInRadius(player);

        if (sheepInRadius.length < 1) return false;

        let sheepId;
        if (sheepInRadius.length === 1) {
            sheepId = sheepInRadius[0].id;
        } else {
            sheepId = this.getClosestSheepId(player, sheepInRadius);
        }
        this.sheep[sheepId].state = SheepStates.CHOSEN;
        this.sheep[sheepId].stopMoving();
        player.chosenSheep = sheepId;
        return true;
    }

    public resetChosenSheep(): void {
        this.sheep.filter(s => s.state === SheepStates.CHOSEN).forEach(s => s.state = SheepStates.ALIVE);
    }

    public killSheep(sheepId: number): void {
        this.sheep[sheepId].state = SheepStates.DECOY;
        this.sheep[sheepId].stopMoving();
    }

    public getAliveSheepCount(): number {
        return this.sheep.filter(s => s.state !== SheepStates.DECOY).length;
    }

    public getSheepData(): SheepData[] {
        return this.sheep.map(sheep => {
            return sheep.getData()
        })
    }
}
