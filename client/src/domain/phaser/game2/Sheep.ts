//import { designDevelopment } from '../../../../utils/constants';
//import { depthDictionary } from '../../../../utils/depthDictionary';
import SheepGameScene from '../../game2/screen/components/SheepGameScene';
import { Coordinates } from '../gameTypes';
import { GameData } from './gameInterfaces/GameData';
import { GameToScreenMapper } from './GameToScreenMapper';
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
        scene: SheepGameScene,
        private index: number,
        public coordinates: Coordinates,
        private gameStateData: GameData,
        private numberPlayers: number,
        private gameToScreenMapper: GameToScreenMapper
    ) {
        this.state = SheepState.ALIVE;
        this.id = gameStateData.sheep[index].id;
        //this.coordinates = gameStateData.sheep[index].coordinates;

        this.renderer = new PhaserSheepRenderer(scene);
        this.renderer.renderSheep(
            {
                x: this.gameToScreenMapper.mapGameXMeasurementToScreen(this.coordinates.x),
                y: this.gameToScreenMapper.mapGameYMeasurementToScreen(this.coordinates.y),
            },
            this.state
        );
    }

    moveSheep(posX: number, posY: number) {
        this.renderer.moveSheep(
            this.gameToScreenMapper.mapGameXMeasurementToScreen(posX),
            this.gameToScreenMapper.mapGameYMeasurementToScreen(posY)
        );
    }

    stopRunning() {
        this.renderer.stopAnimation();
    }
}
