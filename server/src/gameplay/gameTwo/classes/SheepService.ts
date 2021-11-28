import random from 'random';
import InitialParameters from '../constants/InitialParameters';
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


    public getSheep(): Sheep[] {
        return this.sheep;
    }


    public initSheep(): void {
        const seedrandom = require('seedrandom');
        random.use(seedrandom('sheep'));

        for (let i = 0; i < this.sheepCount; i++) {
            let posX: number;
            let posY: number;
            do {
                posX = random.int(InitialParameters.MARGIN, InitialParameters.LENGTH_X - InitialParameters.MARGIN);
                posY = random.int(InitialParameters.MARGIN, InitialParameters.LENGTH_Y - InitialParameters.MARGIN);
            } while (!this.isValidStartingPosition(posX, posY));
            this.sheep.push(new Sheep(posX, posY, this.currentSheepId));
            this.currentSheepId++;
        }
    }
    protected isValidStartingPosition(posX: number, posY: number): boolean {
        let valid = true;

        InitialParameters.PLAYERS_POSITIONS.forEach(player => {
            if (
                Math.abs(player.x - posX) < InitialParameters.MARGIN ||
                Math.abs(player.y - posY) < InitialParameters.MARGIN
            ) {
                valid = false;
                return;
            }
        });
        this.sheep.forEach(sheep => {
            if (
                Math.abs(sheep.posX - posX) < InitialParameters.MARGIN &&
                Math.abs(sheep.posY - posY) < InitialParameters.MARGIN
            ) {
                valid = false;
                return;
            }
        });

        return valid;
    }

    public killSheep(player: GameTwoPlayer): boolean {

        const sheepInRadius = this.sheep.filter(sheep => {
            return (
                sheep.state === SheepStates.ALIVE &&
                Math.abs(sheep.posX - player.posX) <= InitialParameters.KILL_RADIUS &&
                Math.abs(sheep.posY - player.posY) <= InitialParameters.KILL_RADIUS
            );
        });

        this.sheep.forEach(sheep => {
            Math.abs(sheep.posX - player.posX) <= InitialParameters.KILL_RADIUS &&
                Math.abs(sheep.posY - player.posY) <= InitialParameters.KILL_RADIUS;
        });

        if (sheepInRadius.length < 1) {
            return false;
        } else if (sheepInRadius.length === 1) {
            const sheepId = sheepInRadius[0].id;
            this.sheep[sheepId].state = SheepStates.DECOY;
            return true;
        } else {
            /* find the closest sheep in radius */
            let sheepId = sheepInRadius[0].id;
            let minDistance = 1 + InitialParameters.KILL_RADIUS * 2;
            let currentDistance;
            sheepInRadius.forEach(sheep => {
                currentDistance = Math.abs(sheep.posX - player.posX) + Math.abs(sheep.posY - player.posY);
                if (currentDistance < minDistance) {
                    minDistance = currentDistance;
                    sheepId = sheep.id;
                }
            });

            this.sheep[sheepId].state = SheepStates.DECOY;
            return true;
        }
    }

    public getAliveSheepCount(): number {
        const aliveSheep = this.sheep.filter(s => {
            return s.state === SheepStates.ALIVE;
        })
        return aliveSheep.length;
    }
}
