//import { designDevelopment } from '../../../../utils/constants';
//import { depthDictionary } from '../../../../utils/depthDictionary';
import MainScene from '../components/SheepGameScene';
import { GameToScreenMapper } from '../phaser/GameToScreenMapper';
import { Coordinates } from '../phaser/gameTypes/Coordinates';
import { Character } from './gameInterfaces/Character';
import { GameData } from './gameInterfaces/GameData';
import { PhaserSheepRenderer } from './renderer/PhaserSheepRenderer';

export enum SheepState {
    ALIVE = 'alive',
    DEAD = 'dead',
    DECOY = 'decoy',
}

export class Sheep {
    state: SheepState;
    id: string;

    renderer: PhaserSheepRenderer;

    constructor(
        scene: MainScene,
        private index: number,
        public coordinates: Coordinates,
        private gameStateData: GameData,
        private character: Character,
        private numberPlayers: number,
        private gameToScreenMapper: GameToScreenMapper
    ) {
        this.state = gameStateData.sheep[index].state;
        this.id = gameStateData.sheep[index].id;
        this.coordinates = gameStateData.sheep[index].coordinates;

        this.renderer = new PhaserSheepRenderer(scene);
        this.renderer.renderSheep(
            {
                x: this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.x),
                y: this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.y),
            },
            this.state
        );
    }

    moveSheep(posX: number, posY: number) {
        this.renderer.moveSheep(posX, posY);
    }

    stopRunning() {
        this.renderer.stopAnimation();
    }
}
