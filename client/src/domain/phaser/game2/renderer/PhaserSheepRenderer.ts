import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';
import { CharacterAnimationFrames } from '../../gameInterfaces/Character';
import { Coordinates } from '../../gameTypes';
import { Sheep, SheepState } from '../Sheep';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserSheepRenderer {
    private sheep?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(private scene: SheepGameScene) {}

    preload() {
        // TODO: fix animations
        // 0 - 4: right
        // 5 - 9: left
        // 10 - 13: forward
        // 14 - 17: back
    }

    renderSheep(sheep: Sheep) {
        if (sheep.state == SheepState.ALIVE) {
            this.renderSheepInitially(sheep.coordinates);
        } else if (sheep.state == SheepState.DECOY) {
            this.placeDecoy();
        }
    }

    moveSheep(posX?: number, posY?: number) {
        if (posX && this.sheep) {
            if (posX > this.sheep.x) {
                this.startAnimation('sheep_walkRight');
            } else {
                this.stopAnimation();
            }
        }
        this.sheep?.setY(posY);
        this.sheep?.setX(posX);
    }

    destroySheep() {
        this.sheep?.destroy();
    }

    setSheepVisible(isVisible: boolean) {
        this.sheep?.setVisible(isVisible);
    }

    placeDecoy() {
        this.sheep?.setTexture('sheepDecoy');
    }

    private renderSheepInitially(coordinates: Coordinates) {
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkRight', { start: 0, end: 4 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkLeft', { start: 5, end: 9 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkForward', { start: 10, end: 13 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkBack', { start: 14, end: 17 });
        this.sheep = this.scene.physics.add.sprite(coordinates.x, coordinates.y, 'sheepSpritesheet');
        this.sheep.setScale(0.5);
        this.sheep.setDepth(depthDictionary.sheep);
        this.sheep.setCollideWorldBounds(true);
    }

    private initiateAnimation(spritesheetName: string, animationName: string, frames: CharacterAnimationFrames) {
        this.scene.anims.create({
            key: animationName,
            frames: this.scene.anims.generateFrameNumbers(spritesheetName, { start: 0, end: 4 }),
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
