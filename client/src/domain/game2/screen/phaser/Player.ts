//import { designDevelopment } from '../../../../utils/constants';
//import { depthDictionary } from '../../../../utils/depthDictionary';
import { PhaserPlayerRenderer } from '../../../game1/screen/phaser/renderer/PhaserPlayerRenderer';
import MainScene from '../components/SheepGameScene';
import { GameToScreenMapper } from '../phaser/GameToScreenMapper';
import { Coordinates } from '../phaser/gameTypes/Coordinates';
import { AnimationName } from './enums/AnimationNames';
import { Character } from './gameInterfaces/Character';
import { GameData } from './gameInterfaces/GameData';

export class Player {
    username: string;
    userId: string;
    playerRunning: boolean;
    renderer: PhaserPlayerRenderer;

    constructor(
        scene: MainScene,
        private index: number,
        public coordinates: Coordinates,
        private gameStateData: GameData,
        private character: Character,
        private numberPlayers: number,
        private gameToScreenMapper: GameToScreenMapper
    ) {
        this.username = gameStateData.playersState[index].name;
        this.userId = gameStateData.playersState[index].id;
        this.playerRunning = false;

        this.renderer = new PhaserPlayerRenderer(scene, this.numberPlayers);

        this.renderer.renderSheepBackground(window.innerWidth, window.innerHeight);
        this.setPlayer();
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

        this.renderer.renderPlayer(this.index, screenCoordinates, this.character, this.username);
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
