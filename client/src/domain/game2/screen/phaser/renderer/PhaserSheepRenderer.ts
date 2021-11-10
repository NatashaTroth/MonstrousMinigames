import Phaser from 'phaser';

import { depthDictionary } from '../../../../../config/depthDictionary';
import SheepGameScene from '../../components/SheepGameScene';
import { CharacterAnimationFrames } from '../gameInterfaces/Character';
import { Coordinates } from '../gameTypes/Coordinates';
import { SheepState } from '../Sheep';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserSheepRenderer {
    private sheep?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(private scene: SheepGameScene) {}

    preload() {
        // 0 - 4: right
        // 5 - 9: left
        // 10 - 13: forward
        // 14 - 17: back
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkRight', { start: 0, end: 4 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkLeft', { start: 5, end: 9 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkForward', { start: 10, end: 13 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkBack', { start: 14, end: 17 });
    }

    renderSheep(coordinates: Coordinates, sheepState: SheepState) {
        if (!this.sheep) {
            if (sheepState == SheepState.ALIVE) {
                this.renderSheepInitially(coordinates);
            } else if (sheepState == SheepState.DECOY) {
                this.placeDecoy();
            }
        } else if (this.sheep) {
            this.sheep.x = coordinates.x;
            this.sheep.y = coordinates.y;
        }
    }

    moveSheep(plusX?: number, plusY?: number) {
        if (plusY) {
            if (plusY > 0) {
                this.sheep?.play('sheep_walkForward');
            }
            if (plusY < 0) {
                this.sheep?.play('sheep_walkBack');
            }
            this.sheep?.setY(this.sheep?.y + plusY);
        }
        if (plusX) {
            if (plusX > 0) {
                this.sheep?.play('sheep_walkRight');
            }
            if (plusX < 0) {
                this.sheep?.play('sheep_walkLeft');
            }
            this.sheep?.setX(this.sheep?.x + plusX);
        }
    }

    destroySheep() {
        this.sheep?.destroy();
    }

    placeDecoy() {
        this.sheep?.setTexture('sheepDecoy');
    }

    private renderSheepInitially(coordinates: Coordinates) {
        this.sheep = this.scene.physics.add.sprite(coordinates.x, coordinates.y, 'sheepSpritesheet', 11);
        this.sheep.setDepth(depthDictionary.sheep);
        this.sheep.setCollideWorldBounds(true);
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
        this.sheep?.play(animationName);
    }
    stopAnimation() {
        this.sheep?.anims.stop();
    }
}
