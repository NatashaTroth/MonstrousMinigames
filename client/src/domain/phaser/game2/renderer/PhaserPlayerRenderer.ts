import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';
import { Character } from '../../gameInterfaces';
import { CharacterAnimationFrames } from '../../gameInterfaces/Character';
import { Coordinates } from '../../gameTypes';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserPlayerRenderer {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private character?: Character;
    private direction?: string;

    constructor(private scene: SheepGameScene) {}

    renderPlayer(coordinates: Coordinates, character: Character): void {
        this.character = character;
        if (!this.player) {
            this.renderPlayerInitially(coordinates, character.name);
            // frames:
            // 0-3: forward
            // 4-7: left
            // 8-11: right
            // TODO: fix animations, missing walking back animation

            this.initiateAnimation(character.name, character.name.concat('_walkForward'), { start: 0, end: 3 });
            this.initiateAnimation(character.name, character.name.concat('_walkLeft'), { start: 4, end: 7 });
            this.initiateAnimation(character.name, character.name.concat('_walkRight'), { start: 8, end: 11 });
        } else {
            this.player.x = coordinates.x;
            this.player.y = coordinates.y;
        }
    }

    destroyPlayer() {
        this.player?.destroy();
    }

    getMoveDirection(oldX: number, oldY: number, newX: number, newY: number) {
        if (newX == oldX) {
            //move up/down
            if (oldY < newY) {
                return 'down';
            } else if (oldY > newY) {
                return 'up';
            }
            return 'stand';
        }
        if (newY == oldY) {
            //move left/right
            if (oldX < newX) {
                return 'right';
            } else if (oldX > newX) {
                return 'left';
            }
            return 'stand';
        }
        return 'stand';
    }

    movePlayerTo(newXPosition: number, newYPosition: number) {
        if (this.player) {
            const newDirection = this.getMoveDirection(this.player?.x, this.player?.y, newXPosition, newYPosition);
            this.player.x = newXPosition;
            this.player.y = newYPosition;

            if (this.character) {
                if (this.direction != newDirection) {
                    this.direction = newDirection;
                    switch (this.direction) {
                        case 'down':
                            this.startAnimation(this.character.name.concat('_walkForward'));
                            break;
                        case 'left':
                            this.startAnimation(this.character.name.concat('_walkLeft'));
                            break;
                        case 'right':
                            this.startAnimation(this.character.name.concat('_walkRight'));
                            break;
                        case 'up':
                            this.startAnimation(this.character.name.concat('_walkBackward'));
                            break; // TODO: create backwards & diagonal animations
                        default:
                            this.stopAnimation();
                    }
                }
            }
        }
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterSpriteSheetName: string) {
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterSpriteSheetName);
        this.player.setScale(0.1);
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
}
