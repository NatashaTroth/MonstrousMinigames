import SheepGameScene from '../../game2/screen/components/SheepGameScene';
import { AnimationNameGame2 } from '../enums/AnimationName';
import { GameData } from '../game2/gameInterfaces/GameData';
import { Character } from '../gameInterfaces/Character';
import { Coordinates } from '../gameTypes/Coordinates';
import { GameToScreenMapper } from './GameToScreenMapper';
import { PhaserPlayerRenderer } from './renderer/PhaserPlayerRenderer';

export class Player {
    username: string;
    userId: string;
    playerRunning: boolean;
    renderer: PhaserPlayerRenderer;

    constructor(
        scene: SheepGameScene,
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

        this.renderer = new PhaserPlayerRenderer(scene);

        this.renderer.renderSheepBackground(window.innerWidth, window.innerHeight);
        this.setPlayer();
    }

    moveForward(newXPosition: number) {
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
        const animationName = this.character.animations.get(AnimationNameGame2.Running)?.name;
        if (animationName) this.renderer.startAnimation(animationName);
        this.playerRunning = true;
    }

    stopRunning() {
        this.renderer.stopAnimation();
        this.playerRunning = false;
    }
}
