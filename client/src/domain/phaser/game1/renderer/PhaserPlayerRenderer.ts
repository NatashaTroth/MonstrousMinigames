import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import { fireworkFlares } from '../../../game1/screen/components/GameAssets';
import MainScene from '../../../game1/screen/components/MainScene';
import { moveLanesToCenter } from '../../../game1/screen/gameState/moveLanesToCenter';
import * as colors from '../../colors';
import { Character, CharacterAnimation } from '../../gameInterfaces';
import { CharacterAnimationFrames } from '../../gameInterfaces/Character';
import { Coordinates } from '../../gameTypes';
import { Scene } from '../../Scene';
import { SpriteWithDynamicBody } from '../../SpriteWithDynamicBody';
import { sharedTextStyleProperties } from '../../textStyleProperties';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

enum Cave {
    BEHIND = 'caveBehind',
    FRONT = 'caveInFront',
}

interface RendererObstacle {
    phaserInstance: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}
export class PhaserPlayerRenderer {
    public player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private chaser?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private obstacles: RendererObstacle[];
    private skippedObstacles: RendererObstacle[];
    private playerAttention?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private playerWarning?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager[];
    private playerNameBg?: Phaser.GameObjects.Rectangle;
    private playerName?: Phaser.GameObjects.Text;
    private caveBehind?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private caveInFront?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private backgroundElements?: Phaser.GameObjects.Image[];

    constructor(
        private scene: MainScene,
        private numberPlayers: number,
        private laneHeightsPerNumberPlayers: number[]
    ) {
        this.obstacles = [];
        this.skippedObstacles = [];
        this.particles = [];
        this.backgroundElements = [];

        //when <= 2 lanes, make them less high to fit more width

        fireworkFlares.forEach((flare, i) => {
            const particle = this.scene.add.particles(`flare${i}`);
            particle.setDepth(depthDictionary.flares);
            this.particles.push(particle);
        });
    }

    renderBackground(
        windowWidth: number,
        windowHeight: number,
        trackLength: number,
        index: number,
        laneHeight: number,
        posY: number
    ) {
        let i = 0;
        const moon = this.scene.add.image(0, posY, 'moon');
        const newWidth = this.calcWidthKeepAspectRatio(moon, laneHeight);
        moon.setDisplaySize(newWidth, laneHeight);
        moon.setOrigin(0, 1);
        moon.setScrollFactor(0.1);
        moon.setDepth(depthDictionary.moon);
        this.backgroundElements?.push(moon);

        const repeats = Math.ceil(trackLength / newWidth) + 1;
        const backgroundKeys = ['starsAndSky', 'mountains', 'hills', 'trees', 'floor', 'grass'];
        const scrollFactors = [0.1, 0.4, 0.6, 0.9, 1, 1];
        const depths = [
            depthDictionary.sky,
            depthDictionary.mountains,
            depthDictionary.hills,
            depthDictionary.trees,
            depthDictionary.floor,
            depthDictionary.grass,
        ];

        while (i < repeats) {
            backgroundKeys.forEach((backgroundKey, idx) => {
                const element = this.scene.add.image(i * (windowWidth / this.numberPlayers), posY, backgroundKey);
                element.setDisplaySize(newWidth, laneHeight);
                element.setOrigin(0, 1);
                element.setScrollFactor(scrollFactors[idx]);
                element.setDepth(depths[idx]);

                // set new positions, based on size of image
                element.x = i * element.displayWidth;
                if (this.numberPlayers <= 2)
                    element.y = moveLanesToCenter(windowHeight, laneHeight, index, this.numberPlayers);
                this.backgroundElements?.push(element);
            });

            i++;
        }
    }

    private calcWidthKeepAspectRatio(bg: Phaser.GameObjects.Image | Phaser.GameObjects.TileSprite, laneHeight: number) {
        //Keep aspect ratio when setting displaySize
        // oldHeight .... 100%
        // newHeight ... x -> 100 / oldHeight * newHeight
        // ---
        // 100% ...... oldWidth
        // x ......... newWidth -> oldWidth/100 * x

        const oldHeight = bg.displayHeight;
        const backgroundScalingFactor = (100 / oldHeight) * laneHeight;
        const newWidth = (bg.displayWidth / 100) * backgroundScalingFactor;
        return newWidth;
    }

    renderPlayer(idx: number, coordinates: Coordinates, character: Character, username?: string): void {
        let usernameToDisplay = '';
        if (username) {
            usernameToDisplay = username;
        }

        if (!this.player) {
            this.renderPlayerInitially(coordinates, character.name);

            character.animations.forEach((animation: CharacterAnimation) => {
                this.initiateAnimation(character.name, animation.name, animation.frames);
            });
            this.renderPlayerName(idx, usernameToDisplay, coordinates.y);
        } else if (this.player) {
            //only move player
            this.player.x = coordinates.x;
        }
    }

    private renderPlayerName(idx: number, name: string, posY: number) {
        this.playerNameBg = this.scene.add.rectangle(50, posY - 25, 250, 50, 0xb63bd4, 0.7);

        this.playerName = this.scene.make.text({
            x: 20,
            y: posY - 30,
            text: `${name}`,
            style: {
                ...sharedTextStyleProperties,
                fontSize: `${16}px`,
                color: colors.white,
            },
            add: true,
        });

        this.playerNameBg.setDepth(depthDictionary.nameTag);
        this.playerName.setDepth(depthDictionary.nameTag);
        this.playerNameBg.setScrollFactor(0);
        this.playerName.setScrollFactor(0);
    }

    public updatePlayerNamePosition(newX: number, trackLength: number) {
        if (this.playerNameBg && this.playerNameBg.x < trackLength - this.scene.windowWidth) {
            this.playerNameBg?.setPosition(newX, this.playerNameBg.y);
            this.playerName?.setPosition(newX, this.playerName.y);
        }
    }

    renderChasers(chasersPositionX: number, chasersPositionY: number) {
        if (!this.chaser) {
            this.scene.anims.create({
                key: 'chasersAnimation',
                frames: this.scene.anims.generateFrameNumbers('chasersSpritesheet', { start: 0, end: 5 }),
                frameRate: 15,
                repeat: -1,
            });
            this.chaser = this.scene.physics.add.sprite(-1, chasersPositionY, 'chasersSpritesheet');
            this.chaser.setScale(
                (0.7 / this.numberPlayers) * this.laneHeightsPerNumberPlayers![this.numberPlayers - 1]
            );
            this.chaser.setDepth(depthDictionary.chaser);
            this.chaser.y = this.chaser.y - this.chaser.displayHeight / 2; //set correct y pos according to player height
            this.chaser.play('chasersAnimation');
        }
        this.chaser.setX(chasersPositionX - 50); // - 50 so that not quite on top of player when caught
    }

    destroyPlayer() {
        this.player?.destroy();
    }

    stunPlayer(animationName: string) {
        const pebble = this.scene.physics.add.sprite(
            this.player!.x,
            this.backgroundElements![0].y - this.backgroundElements![0].displayHeight,
            'pebble'
        );
        pebble.setScale((0.4 / this.numberPlayers) * this.laneHeightsPerNumberPlayers![this.numberPlayers - 1]);
        pebble.y += pebble.displayHeight / 2;
        pebble.body.setGravity(0, 1200);
        pebble.setCollideWorldBounds(true);
        const destroyPebbleInterval = setInterval(() => {
            if (pebble.y > this.player!.y - (this.player!.displayHeight / 5) * 2.5) {
                clearInterval(destroyPebbleInterval);
                pebble.destroy();
                this.startAnimation(animationName);
            }
        }, 100);
    }

    renderCave(posX: number, posY: number) {
        posX -= 30; // move the cave slightly to the left, so the monster runs fully into the cave
        const scale = (0.9 / this.numberPlayers) * this.laneHeightsPerNumberPlayers![this.numberPlayers - 1];
        const yOffset = 2.2;
        this.caveBehind = this.scene.physics.add.sprite(posX, posY, Cave.BEHIND);
        this.caveBehind.setScale(scale);
        this.caveBehind.setDepth(depthDictionary.caveBehind);
        this.caveBehind.y -= this.caveBehind.displayHeight / yOffset; /// (0.01 * numberPlayers);

        this.caveInFront = this.scene.physics.add.sprite(posX, posY, Cave.FRONT);
        this.caveInFront.setScale(scale);
        this.caveInFront.setDepth(depthDictionary.caveInFront);
        this.caveInFront.y -= this.caveInFront.displayHeight / yOffset; //(0.01 * numberPlayers);
    }

    handlePlayerDead() {
        if (this.backgroundElements && this.backgroundElements.length > 0) {
            this.backgroundElements.forEach(img => {
                img.setTint(0x123a3a);
            });
            const yPos = this.backgroundElements[0].y;
            const height = this.backgroundElements[0].displayHeight;
            const fixedWidth = 1200;

            const text = this.scene.make.text({
                x: this.scene.windowWidth / 2 - fixedWidth / 2,
                y: yPos - height / 2,
                text: 'The mosquito caught you. Look at your phone!',
                style: {
                    ...sharedTextStyleProperties,
                    fontSize: `${35}px`,
                    color: colors.orange,
                    stroke: colors.orange,
                    strokeThickness: 1,
                    fixedWidth,
                    align: 'center',
                    shadow: {
                        offsetX: 10,
                        offsetY: 10,
                        color: colors.black,
                        blur: 0,
                        stroke: false,
                        fill: false,
                    },
                },
                add: true,
            });
            text.scrollFactorX = 0;
            text.setDepth(depthDictionary.deadText);
        }
    }

    renderObstacles(posX: number, posY: number, obstacleScale: number, obstacleType: string, depth: number) {
        const obstacle = this.scene.physics.add.sprite(posX, posY, obstacleType);
        obstacle.setScale(obstacleScale * this.laneHeightsPerNumberPlayers![this.numberPlayers - 1]);

        obstacle.y -= obstacle.displayHeight / 1.3;
        obstacle.setDepth(depth);

        this.obstacles.push({ phaserInstance: obstacle });
    }

    renderFireworks(posX: number, posY: number, laneHeight: number) {
        const scales: Array<number | { min: number; max: number }> = [0.1, 0.08, { min: 0, max: 0.1 }];
        const lifespans: number[] = [250, 500, 700];

        this.particles.forEach((particle, i) => {
            const particlesEmitter = particle.createEmitter({
                x: posX,
                y: posY - (laneHeight / 4) * 3,
                scale: scales[i],
                speed: 75,
                blendMode: 'ADD',
                lifespan: lifespans[i],
            });
            particlesEmitter.on = true;
            setTimeout(() => (particlesEmitter.on = false), 900);
        });
    }

    movePlayerForward(newXPosition: number) {
        if (this.player) {
            this.player.x = newXPosition;
        }
    }

    destroyObstacle() {
        const currentObstacle = this.obstacles.shift();
        currentObstacle?.phaserInstance.destroy();
    }

    handleSkippedObstacle() {
        const currentObstacle = this.obstacles.shift();
        if (currentObstacle) this.skippedObstacles.push(currentObstacle);
    }

    destroyObstacles() {
        this.obstacles.forEach(obstacle => {
            obstacle.phaserInstance.destroy();
        });

        this.skippedObstacles.forEach(obstacle => {
            obstacle.phaserInstance.destroy();
        });
    }

    destroyCave() {
        this.caveBehind?.destroy();
        this.caveInFront?.destroy();
    }

    destroyChaser() {
        this.chaser?.destroy();
    }

    renderAttentionIcon() {
        if (!this.playerAttention && this.player) {
            this.playerAttention = this.scene.physics.add
                .sprite(
                    this.player.x + this.player.displayWidth / 2,
                    this.player.y - this.player.displayHeight / 2,
                    'attention'
                )
                .setDepth(depthDictionary.attention)
                .setScale((1 / this.numberPlayers) * this.laneHeightsPerNumberPlayers![this.numberPlayers - 1]);
        }
    }

    renderWarningIcon() {
        if (!this.playerWarning && this.player) {
            this.playerWarning = this.scene.physics.add
                .sprite(
                    this.player.x + this.player.displayWidth / 2,
                    this.player.y - this.player.displayHeight / 2,
                    'warning'
                )
                .setDepth(depthDictionary.attention)
                .setScale((1 / this.numberPlayers) * this.laneHeightsPerNumberPlayers![this.numberPlayers - 1]);
        }
    }

    destroyAttentionIcon() {
        this.playerAttention?.destroy();
        this.playerAttention = undefined;
    }

    destroyWarningIcon() {
        this.playerWarning?.destroy();
        this.playerWarning = undefined;
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterSpriteSheetName: string) {
        this.player = handleRenderPlayer(
            this.scene,
            this.numberPlayers,
            this.laneHeightsPerNumberPlayers,
            coordinates,
            monsterSpriteSheetName
        );
    }

    private initiateAnimation(spritesheetName: string, animationName: string, frames: CharacterAnimationFrames) {
        this.scene.anims.create({
            key: animationName,
            frames: this.scene.anims.generateFrameNumbers(spritesheetName, frames),
            frameRate: 6,
            repeat: -1,
        });
    }

    startAnimation(animationName: string | undefined) {
        if (animationName !== undefined) {
            this.player?.play(animationName);
        }
    }
    stopAnimation() {
        this.player?.anims?.stop();
    }

    renderWind() {
        handleRenderWind(this.chaser, this.scene, this.numberPlayers, this.laneHeightsPerNumberPlayers);
    }

    destroyEverything() {
        this.destroyChaser();
        this.destroyAttentionIcon();
        this.destroyCave();
        this.destroyObstacle();
        this.destroyWarningIcon();
        this.destroyPlayer();
    }
}

export function handleRenderPlayer(
    scene: Scene,
    numberPlayers: number,
    laneHeightsPerNumberPlayers: number[],
    coordinates: Coordinates,
    monsterSpriteSheetName: string
) {
    const player = scene.physics.add.sprite(coordinates.x, coordinates.y, monsterSpriteSheetName, 20);
    player.setDepth(depthDictionary.player);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale((0.66 / numberPlayers) * laneHeightsPerNumberPlayers[numberPlayers - 1]);
    player.y = player.y - player.displayHeight / 2; //set correct y pos according to player height

    return player as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
}

export function handleRenderWind(
    chaser: SpriteWithDynamicBody | undefined,
    scene: Scene,
    numberPlayers: number,
    laneHeightsPerNumberPlayers: number[]
) {
    if (chaser) {
        scene.anims.create({
            key: 'windAnimation',
            frames: scene.anims.generateFrameNumbers('windSpritesheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0,
        });
        const wind = scene.physics.add.sprite(chaser.x - 50, chaser.y + 30, 'windSpritesheet');
        handleWindAnimation(wind, numberPlayers, laneHeightsPerNumberPlayers);
        return wind as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    }
}

export function handleWindAnimation(
    wind: SpriteWithDynamicBody,
    numberPlayers: number,
    laneHeightsPerNumberPlayers: number[]
) {
    wind.setScale((0.5 / numberPlayers) * laneHeightsPerNumberPlayers[numberPlayers - 1]);
    wind.setDepth(depthDictionary.chaser);
    wind.y = wind.y - wind.displayHeight / 2; //set correct y pos according to player height
    wind.play('windAnimation');
    wind.on('animationcomplete', wind.destroy);
}
