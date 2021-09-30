//import { designDevelopment } from '../../../../utils/constants';
//import { depthDictionary } from '../../../../utils/depthDictionary';
import MainScene from '../components/SheepGameScene';
import { GameToScreenMapper } from '../phaser/GameToScreenMapper';
import { Coordinates } from '../phaser/gameTypes/Coordinates';
import { PhaserPlayerRenderer } from '../phaser/renderer/PhaserPlayerRenderer';
import { AnimationName } from './enums/AnimationNames';
import { Character } from './gameInterfaces/Character';
import { GameData } from './gameInterfaces/GameData';
import { PhaserSheepRenderer } from './renderer/PhaserSheepRenderer';

export enum SheepState {
    ALIVE = 'alive',
    DEAD = 'dead',
    DECOY = 'decoy'
}

export class Sheep {
    posX: number;
    posY: number;
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
        this.posX = gameStateData.sheep[index].posX;
        this.posY = gameStateData.sheep[index].posY;
        this.state = gameStateData.sheep[index].state;
        this.id = gameStateData.sheep[index].id;

        this.renderer = new PhaserSheepRenderer(scene);
        this.renderer.renderSheep({x: this.posX, y: this.posY}, this.state);
    }

    moveForward(newXPosition: number, trackLength: number) {
        //TODO

        if (newXPosition == this.coordinates.x && this.playerRunning) {
            this.stopRunning();
        } else {
            if (!this.playerRunning) {
                this.startRunning();
            }
        }

        this.coordinates.x = newXPosition;
        this.renderer.movePlayerForward(this.gameToScreenMapper.mapGameMeasurementToScreen(newXPosition));
    }

    private setPlayer() {
        const screenCoordinates = {
            x: this.gameToScreenMapper.mapGameMeasurementToScreen(this.coordinates.x),
            y: this.coordinates.y,
        };

        this.renderer.renderPlayer(screenCoordinates, this.character);
    }

    startRunning() {
        const animationName = this.character.animations.get(AnimationName.Running)?.name;
        if (animationName) this.renderer.startAnimation(animationName);
        this.playerRunning = true;
    }

    stopRunning() {
        this.renderer.stopAnimation();
        this.playerRunning = false;
    }
}
