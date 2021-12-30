import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';
import { CharacterAnimationFrames } from '../../gameInterfaces/Character';
import { Coordinates } from '../../gameTypes';
import { SheepState } from '../Sheep';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserSheepRenderer {
    private sheep?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private direction?: string;

    constructor(private scene: SheepGameScene) {}

    preload() {
        // TODO: fix animations
        // 0 - 4: right
        // 5 - 9: left
        // 10 - 13: forward
        // 14 - 17: back
    }

    getMoveDirection(oldX: number, oldY: number, newX?: number, newY?: number) {
        if (newX == oldX) {
            //move up/down
            if (newY) {
                if (oldY < newY) {
                    return 'down';
                } else if (oldY > newY) {
                    return 'up';
                }
                return 'stand';
            }
        }

        if (newY == oldY) {
            if (newX) {
                //move left/right
                if (oldX < newX) {
                    return 'right';
                } else if (oldX > newX) {
                    return 'left';
                }
                return 'stand';
            }
        }
        return 'stand';
    }

    renderSheep(coordinates: Coordinates, state: SheepState) {
        if (state == SheepState.ALIVE) {
            this.renderSheepInitially(coordinates);
        } else if (state == SheepState.DECOY) {
            this.placeDecoy();
        }
    }

    moveSheep(posX?: number, posY?: number) {
        if (this.sheep) {
            const newDirection = this.getMoveDirection(this.sheep.x, this.sheep.y, posX, posY);
            if (newDirection != this.direction) {
                this.direction = newDirection;
                switch (this.direction) {
                    case 'down':
                        this.startAnimation('sheep_walkForward');
                        break;
                    case 'left':
                        this.startAnimation('sheep_walkLeft');
                        break;
                    case 'right':
                        this.startAnimation('sheep_walkRight');
                        break;
                    case 'up':
                        this.startAnimation('sheep_walkBackward');
                        break; // TODO: create diagonal animations
                    default:
                        this.stopAnimation();
                }
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
        this.sheep = this.scene.physics.add.sprite(coordinates.x, coordinates.y, 'sheepSpritesheet');
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkRight', { start: 0, end: 4 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkLeft', { start: 5, end: 9 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkForward', { start: 10, end: 14 });
        this.initiateAnimation('sheepSpritesheet', 'sheep_walkBackward', { start: 15, end: 18 });
        this.sheep.setScale(0.5);

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
