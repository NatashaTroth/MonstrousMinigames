import Phaser from 'phaser';

import { depthDictionary } from '../../../../utils/depthDictionary';
import { fireworkFlares } from '../../components/GameAssets';
import MainScene from '../../components/MainScene';
import { Character, CharacterAnimation } from '../gameInterfaces';
import { CharacterAnimationFrames } from '../gameInterfaces/Character';
import { Coordinates } from '../gameTypes';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */

interface RendererObstacle {
    phaserInstance: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    skippable: boolean;
}
export class PhaserPlayerRenderer {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private chaser?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private obstacles: RendererObstacle[];
    private skippableObstacles: RendererObstacle[];
    private playerAttention?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager[];
    private playerNameBg?: Phaser.GameObjects.Rectangle;
    private playerName?: Phaser.GameObjects.Text;
    private caveBehind?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private caveInFront?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private backgroundLane?: Phaser.GameObjects.Image[];
    //private backgroundLane?: Phaser.GameObjects.TileSprite[]; // for tile parallax

    constructor(
        private scene: MainScene,
        private numberPlayers: number,
        private laneHeightsPerNumberPlayers: number[]
    ) {
        this.obstacles = [];
        this.skippableObstacles = [];
        this.particles = [];
        this.backgroundLane = []; //TODO change
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
        moon.setScrollFactor(0.2);
        moon.setDepth(depthDictionary.moon);

        const repeats = Math.ceil(trackLength / newWidth) + 1;

        while (i < repeats) {
            const sky = this.scene.add.image(i * (windowWidth / this.numberPlayers), posY, 'starsAndSky');
            sky.setDisplaySize(newWidth, laneHeight);
            sky.setOrigin(0, 1);
            sky.setScrollFactor(0.2);
            sky.setDepth(depthDictionary.sky);

            const mountains = this.scene.add.image(i * (windowWidth / this.numberPlayers), posY, 'mountains');
            mountains.setDisplaySize(newWidth, laneHeight);
            mountains.setOrigin(0, 1);
            mountains.setScrollFactor(0.4);
            mountains.setDepth(depthDictionary.mountains);

            const hills = this.scene.add.image(i * (windowWidth / this.numberPlayers), posY, 'hills');
            hills.setDisplaySize(newWidth, laneHeight);
            hills.setOrigin(0, 1);
            hills.setScrollFactor(0.6);
            hills.setDepth(depthDictionary.hills);

            const trees = this.scene.add.image(i * (windowWidth / this.numberPlayers), posY, 'trees');
            trees.setDisplaySize(newWidth, laneHeight);
            trees.setOrigin(0, 1);
            trees.setScrollFactor(0.8);
            trees.setDepth(depthDictionary.trees);

            const floor = this.scene.add.image(i * (windowWidth / this.numberPlayers), posY, 'floor');
            floor.setDisplaySize(newWidth, laneHeight);
            floor.setOrigin(0, 1);
            floor.setScrollFactor(1);
            floor.setDepth(depthDictionary.floor);

            // // Background without parallax
            // const bg = this.scene.add.image((i * windowWidth) / this.numberPlayers, posY, 'laneBackground');
            // const newWidth = this.calcWidthKeepAspectRatio(bg, laneHeight);
            // if (i === 0) {
            //     repeats = Math.ceil(trackLength / newWidth);
            // }
            // bg.setDisplaySize(newWidth, laneHeight);
            // bg.setOrigin(0, 1);
            // bg.setScrollFactor(1);

            // set new positions, based on size of image

            const laneBg = [sky, mountains, hills, trees, floor];
            laneBg.forEach(element => {
                element.x = i * element.displayWidth;
                if (this.numberPlayers <= 2) element.y = this.moveLanesToCenter(windowHeight, laneHeight, index);
                this.backgroundLane?.push(element);
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

    private moveLanesToCenter(windowHeight: number, newHeight: number, index: number) {
        return (windowHeight - newHeight * this.numberPlayers) / 2 + newHeight * (index + 1);
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
        // this.playerName = this.scene.add.text(100, window.innerHeight / numberPlayers - 20, 'lsjhdf');

        this.playerName = this.scene.make.text({
            x: 20,
            // x: this.scene.camera?.scrollX,
            y: posY - 30, //(window.innerHeight / this.numberPlayers) * (idx + 1) - 30,
            text: `${name}`,
            style: {
                fontSize: `${16}px`,
                fontFamily: 'Roboto, Arial',
                color: '#fff',
            },
            add: true,
        });

        this.playerNameBg.setDepth(depthDictionary.nameTag);
        this.playerName.setDepth(depthDictionary.nameTag);
        this.playerNameBg.setScrollFactor(0);
        this.playerName.setScrollFactor(0);
    }

    public updatePlayerNamePosition(newX: number, trackLength: number) {
        if (this.playerNameBg && this.playerNameBg.x < trackLength - window.innerWidth) {
            this.playerNameBg?.setPosition(newX, this.playerNameBg.y);
            this.playerName?.setPosition(newX, this.playerName.y);
        }
    }

    renderChasers(chasersPositionX: number, chasersPositionY: number) {
        if (!this.chaser) {
            this.chaser = this.scene.physics.add.sprite(-1, chasersPositionY, 'chasers');
            this.chaser.setScale(
                (1.25 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]
            );
            this.chaser.setDepth(depthDictionary.chaser);
            this.chaser.y = this.chaser.y - this.chaser.displayHeight / 2; //set correct y pos according to player height
        }
        this.chaser.setX(chasersPositionX - 50); // - 50 so that not quite on top of player when caught
    }

    destroyPlayer() {
        this.player?.destroy();
    }

    stunPlayer(animationName: string) {
        // if (this.player) this.player.alpha = 0.5;
        const pebble = this.scene.physics.add.sprite(
            this.player!.x,
            this.backgroundLane![0].y - this.backgroundLane![0].displayHeight,
            'pebble'
        );
        pebble.setScale((0.4 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);
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
        // posY += 5;
        const scale = (0.9 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1];
        const yOffset = 2.2;
        this.caveBehind = this.scene.physics.add.sprite(posX, posY, 'caveBehind'); //TODO change caveBehind to enum
        this.caveBehind.setScale(scale);
        this.caveBehind.setDepth(depthDictionary.caveBehind);
        this.caveBehind.y -= this.caveBehind.displayHeight / yOffset; /// (0.01 * numberPlayers);

        this.caveInFront = this.scene.physics.add.sprite(posX, posY, 'caveInFront'); //TODO change caveInFront to enum
        this.caveInFront.setScale(scale);
        this.caveInFront.setDepth(depthDictionary.caveInFront);
        this.caveInFront.y -= this.caveInFront.displayHeight / yOffset; //(0.01 * numberPlayers);
    }

    handlePlayerDead() {
        //TODO change later - no need to color images that have already gone past
        if (this.backgroundLane && this.backgroundLane.length > 0) {
            this.backgroundLane.forEach(img => {
                // img.setAlpha(0.3);
                img.setTint(0x123a3a); //081919);
                // img.setDepth(depthDictionary.deadTextBackground);
            });
            const yPos = this.backgroundLane[0].y;
            const height = this.backgroundLane[0].displayHeight;
            const fixedWidth = 1200;

            const text = this.scene.make.text({
                x: window.innerWidth / 2 - fixedWidth / 2,
                // x: this.scene.camera?.scrollX,
                y: yPos - height / 2,
                text: 'The mosquito caught you. Look at your phone!',
                style: {
                    fontSize: `${35}px`,
                    fontFamily: 'Roboto, Arial',
                    // color: '#d2a44f',
                    // stroke: '#d2a44f',
                    color: '#d2a44f',
                    stroke: '#d2a44f',
                    strokeThickness: 1,
                    fixedWidth,
                    align: 'center',
                    shadow: {
                        offsetX: 10,
                        offsetY: 10,
                        color: '#000',
                        blur: 0,
                        stroke: false,
                        fill: false,
                    },
                },

                // origin: {x: 0.5, y: 0.5},
                add: true,
            });
            text.scrollFactorX = 0;
            text.setDepth(depthDictionary.deadText);
        }
    }

    renderObstacles(
        posX: number,
        posY: number,
        obstacleScale: number,
        obstacleType: string,
        depth: number,
        skippable: boolean
    ) {
        const obstacle = this.scene.physics.add.sprite(posX, posY, obstacleType);
        obstacle.setScale(obstacleScale * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);

        obstacle.y -= obstacle.displayHeight / 1.3;
        obstacle.setDepth(depth);

        this.obstacles.push({ phaserInstance: obstacle, skippable });
    }

    renderFireworks(posX: number, posY: number, laneHeight: number) {
        // const flareColors: string[] = ['blue', 'red', 'green'];
        const scales: Array<number | { min: number; max: number }> = [0.1, 0.08, { min: 0, max: 0.1 }];
        const lifespans: number[] = [250, 500, 700];

        this.particles.forEach((particle, i) => {
            const particlesEmitter = particle.createEmitter({
                // key: flare,
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
        if (currentObstacle) {
            if (!currentObstacle.skippable) {
                currentObstacle.phaserInstance.destroy();
            } else {
                this.skippableObstacles.push(currentObstacle);
            }
        }
    }
    destroyObstacles() {
        this.obstacles.forEach(obstacle => {
            obstacle.phaserInstance.destroy();
        });

        this.skippableObstacles.forEach(obstacle => {
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
                .setScale((0.085 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);
        }
    }

    destroyAttentionIcon() {
        this.playerAttention?.destroy();
        this.playerAttention = undefined;
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterSpriteSheetName: string) {
        // eslint-disable-next-line no-console
        // console.log(' coordinates.y + window.innerHeight / 15');
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterSpriteSheetName, 20);

        this.player.setDepth(depthDictionary.player);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale((0.66 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);
        this.player.y = this.player.y - this.player.displayHeight / 2; //set correct y pos according to player height
    }

    private initiateAnimation(spritesheetName: string, animationName: string, frames: CharacterAnimationFrames) {
        this.scene.anims.create({
            key: animationName,
            frames: this.scene.anims.generateFrameNumbers(spritesheetName, frames),
            frameRate: 6,
            repeat: -1,
        });

        //`${monsterName}_stunned`
    }

    startAnimation(animationName: string) {
        this.player?.play(animationName);
    }
    stopAnimation() {
        this.player?.anims.stop();
    }
}
