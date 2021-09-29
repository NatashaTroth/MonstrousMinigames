import Phaser from 'phaser';

import { depthDictionary } from '../../../../../utils/depthDictionary';
import SheepGameScene from '../../components/SheepGameScene';
import { Character, CharacterAnimation } from '../gameInterfaces/Character';
import { CharacterAnimationFrames } from '../gameInterfaces/Character';
import { Coordinates } from '../gameTypes/Coordinates';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserPlayerRenderer {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(private scene: SheepGameScene) {}

    renderBackground() {
        this.scene.add.image(0, 0, 'forest2'); //TODO: replace bg image
    }

    renderPlayer(coordinates: Coordinates, character: Character): void {
        if (!this.player) {
            this.renderPlayerInitially(coordinates, character.name);

            character.animations.forEach((animation: CharacterAnimation) => {
                this.initiateAnimation(character.name, animation.name, animation.frames);
            });
        } else if (this.player) {
            //only move player
            this.player.x = coordinates.x;
            this.player.y = coordinates.y;
        }
    }

    destroyPlayer() {
        this.player?.destroy();
    }

    movePlayerForward(newXPosition: number) {
        if (this.player) {
            this.player.x = newXPosition;
        }
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterSpriteSheetName: string) {
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterSpriteSheetName, 20);
        this.player.setDepth(depthDictionary.player);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
    }

    private initiateAnimation(spritesheetName: string, animationName: string, frames: CharacterAnimationFrames) {
        this.scene.anims.create({
            key: animationName,
            frames: this.scene.anims.generateFrameNumbers(spritesheetName, frames),
            frameRate: 6,
            repeat: -1,
        });
    }

    startAnimation(animationName: string) {
        this.player?.play(animationName);
    }
    stopAnimation() {
        this.player?.anims.stop();
    }
}
