import Phaser from 'phaser';

import { depthDictionary } from '../../../../../config/depthDictionary';
import SheepGameScene from '../../components/SheepGameScene';
import { Character, CharacterAnimationFrames } from '../gameInterfaces/Character';
import { Coordinates } from '../gameTypes/Coordinates';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserPlayerRenderer {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(private scene: SheepGameScene) {}

    renderBackground() {
        const bg = this.scene.add.image(0, 0, 'forest2'); //TODO: replace bg image
        bg.setScale(0.4);
    }

    renderPlayer(coordinates: Coordinates, character: Character): void {
        if (!this.player) {
            this.renderPlayerInitially(coordinates, character.name);
            // frames:
            // 0-3: forward
            // 4-7: left
            // 8-11: right
            // TODO: missing walking back animation
            this.initiateAnimation(character.name, character.name + +'_walkForward', { start: 0, end: 3 });
            this.initiateAnimation(character.name, character.name + +'_walkLeft', { start: 4, end: 7 });
            this.initiateAnimation(character.name, character.name + +'_walkRight', { start: 8, end: 11 });
        } else if (this.player) {
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

    renderSheepBackground(width: number, height: number) {
        const element = this.scene.add.image(0, 0, 'forest2');
        element.setDisplaySize(width, height);
        element.setOrigin(0, 1);
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterSpriteSheetName: string) {
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterSpriteSheetName, 20);
        this.player.setScale(0.2);
        this.player.setDepth(depthDictionary.player);
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

    movePlayer(character: Character, plusX?: number, plusY?: number) {
        if (plusY) {
            if (plusY > 0) {
                this.player?.play(`${character.name}_walkForward`);
            }
            if (plusY < 0) {
                this.player?.play(`${character.name}_walkBack`);
            }
            this.player?.setY(this.player?.y + plusY);
        }
        if (plusX) {
            if (plusX > 0) {
                this.player?.play(`${character.name}_walkRight`);
            }
            if (plusX < 0) {
                this.player?.play(`${character.name}_walkLeft`);
            }
            this.player?.setX(this.player?.x + plusX);
        }
    }
}
