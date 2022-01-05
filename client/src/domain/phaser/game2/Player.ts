import SheepGameScene from '../../game2/screen/components/SheepGameScene';
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
        index: number,
        public coordinates: Coordinates,
        gameStateData: GameData,
        private character: Character,
        numberPlayers: number,
        private gameToScreenMapper: GameToScreenMapper
    ) {
        this.username = gameStateData.playersState[index].name;
        this.userId = gameStateData.playersState[index].id;
        this.playerRunning = false;

        this.renderer = new PhaserPlayerRenderer(scene);

        this.setPlayer();
    }

    moveTo(newXPosition: number, newYPosition: number) {
        if (newXPosition === this.coordinates.x && newYPosition === this.coordinates.y && this.playerRunning) {
            this.stopRunning();
        } else if (!this.playerRunning) {
            this.startRunning();
        }

        this.coordinates.x = newXPosition;
        this.coordinates.y = newYPosition;
        this.renderer.movePlayerTo(
            this.gameToScreenMapper.mapGameXMeasurementToScreen(this.coordinates.x),
            this.gameToScreenMapper.mapGameYMeasurementToScreen(this.coordinates.y)
        );
    }

    private setPlayer() {
        const screenCoordinates = {
            x: this.gameToScreenMapper.mapGameXMeasurementToScreen(this.coordinates.x),
            y: this.gameToScreenMapper.mapGameYMeasurementToScreen(this.coordinates.y),
        };

        this.renderer.renderPlayer(screenCoordinates, this.character, this.username);
    }

    startRunning() {
        this.playerRunning = true;
    }

    stopRunning() {
        this.renderer.stopAnimation();
        this.playerRunning = false;
    }
}
