import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';
import * as colors from '../../colors';
import { Character } from '../../gameInterfaces';
import { CharacterAnimationFrames } from '../../gameInterfaces/Character';
import { Coordinates } from '../../gameTypes';
import { Scene } from '../../Scene';
import { loadingTextStyleProperties } from '../../textStyleProperties';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

export class PhaserPlayerRenderer {
    private player: {
        name?: Phaser.GameObjects.Text;
        body?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    };
    private character?: Character;
    private direction?: string;

    constructor(private scene: SheepGameScene) {
        this.player = {};
    }

    renderPlayer(coordinates: Coordinates, character: Character, playerName: string): void {
        this.character = character;
        if (!this.player.body || !this.player.name) {
            this.renderPlayerInitially(coordinates, character, playerName);
            // frames:
            // 0-3: forward
            // 4-7: left
            // 8-11: right
            // TODO: fix animations, missing walking back animation

            this.initiateAnimation(character.name, character.name.concat('_walkForward'), { start: 0, end: 3 });
            this.initiateAnimation(character.name, character.name.concat('_walkLeft'), { start: 4, end: 7 });
            this.initiateAnimation(character.name, character.name.concat('_walkRight'), { start: 8, end: 11 });
            this.initiateAnimation(character.name, character.name.concat('_walkBack'), { start: 16, end: 19 });
            this.initiateAnimation(character.name, character.name.concat('_walkNortheast'), { start: 20, end: 23 });
            this.initiateAnimation(character.name, character.name.concat('_walkNorthwest'), { start: 24, end: 27 });
            this.initiateAnimation(character.name, character.name.concat('_walkSoutheast'), { start: 28, end: 31 });
            this.initiateAnimation(character.name, character.name.concat('_walkSouthwest'), { start: 32, end: 35 });
        } else {
            this.player.body.x = coordinates.x;
            this.player.body.y = coordinates.y;

            this.player.name.x = coordinates.x - this.player.body.displayWidth / 2;
            this.player.name.y = coordinates.y - this.player.body.displayHeight / 2 - 20;
        }
    }

    destroyPlayer() {
        this.player.body?.destroy();
        this.player.name?.destroy();
    }

    getMoveDirection(oldX: number, oldY: number, newX: number, newY: number) {
        if (newX === oldX) {
            //move up/down
            if (oldY < newY) {
                return 'down';
            } else if (oldY > newY) {
                return 'up';
            }

            return 'stand';
        }
        if (newY === oldY) {
            //move left/right
            if (oldX < newX) {
                return 'right';
            } else if (oldX > newX) {
                return 'left';
            }
            return 'stand';
        }

        if (newY < oldY && newX < oldX) {
            return 'northwest';
        } else if (newY > oldY && newX < oldX) {
            return 'southwest';
        } else if (newY < oldY && newX > oldX) {
            return 'northeast';
        } else if (newY > oldY && newX > oldX) {
            return 'southeast';
        }
        return 'stand';
    }

    movePlayerTo(newXPosition: number, newYPosition: number) {
        if (this.player.body) {
            const newDirection = this.getMoveDirection(
                this.player.body.x,
                this.player.body.y,
                newXPosition,
                newYPosition
            );
            this.player.body.x = newXPosition;
            this.player.body.y = newYPosition;

            if (this.player.name) {
                this.player.name.x = newXPosition - this.player.body.displayWidth / 2;
                this.player.name.y = newYPosition - this.player.body.displayHeight / 2 - 20;
            }

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
                            this.startAnimation(this.character.name.concat('_walkBack'));
                            break;
                        case 'southeast':
                            this.startAnimation(this.character.name.concat('_walkSoutheast'));
                            break;
                        case 'southwest':
                            this.startAnimation(this.character.name.concat('_walkSouthwest'));
                            break;
                        case 'northeast':
                            this.startAnimation(this.character.name.concat('_walkNortheast'));
                            break;
                        case 'northwest':
                            this.startAnimation(this.character.name.concat('_walkNorthwest'));
                            break;
                        default:
                            this.stopAnimation();
                    }
                }
            }
        }
    }

    private renderPlayerInitially(coordinates: Coordinates, character: Character, playerName: string) {
        this.player.body = handleRenderPlayer(this.scene, coordinates, character.name);
        // this.player.body = this.scene.physics.add.sprite(coordinates.x, coordinates.y, character.name);
        // this.player.body.setScale(0.1);
        // this.player.body.setDepth(depthDictionary.player);
        // this.player.body.setCollideWorldBounds(true);

        this.player.name = this.scene.make.text({
            x: this.player.body.x - this.player.body.displayWidth / 2,
            y: this.player.body.y - this.player.body.displayHeight / 2 - 20,
            text: playerName,
            style: {
                ...loadingTextStyleProperties,
                fontSize: `20px`,
                color: colors.black,
                fontStyle: 'bold',
            },
        });
        this.player.name.setDepth(depthDictionary.percentText);
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
        this.player.body?.play(animationName);
    }
    stopAnimation() {
        this.player.body?.anims.stop();
    }
}

export function handleRenderPlayer(scene: Scene, coordinates: Coordinates, monsterSpriteSheetName: string) {
    const player = scene.physics.add.sprite(coordinates.x, coordinates.y, monsterSpriteSheetName);
    player.setScale(0.1);
    player.setDepth(depthDictionary.player);
    player.setCollideWorldBounds(true);

    return player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}
