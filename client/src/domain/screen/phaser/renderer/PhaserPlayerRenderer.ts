import Phaser from 'phaser';

import { depthDictionary } from '../../../../utils/depthDictionary';
import { fireworkFlares } from '../../components/GameAssets';
import MainScene from '../../components/MainScene';
import { GameToScreenMapper } from '../GameToScreenMapper';
import { Coordinates } from '../gameTypes';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserPlayerRenderer {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    // private playerText?: Phaser.GameObjects.Text;
    private chaser?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private playerObstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[];
    private playerAttention?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager[];
    private playerNameBg?: Phaser.GameObjects.Rectangle;
    private playerName?: Phaser.GameObjects.Text;
    private caveBehind?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private caveInFront?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private backgroundLane?: Phaser.GameObjects.Image[];
    private gameToScreenMapper?: GameToScreenMapper;

    constructor(
        private scene: MainScene,
        private numberPlayers: number,
        private laneHeightsPerNumberPlayers: number[]
    ) {
        this.playerObstacles = [];
        this.particles = [];
        this.backgroundLane = []; //TODO change
        //when <= 2 lanes, make them less high to fit more width

        fireworkFlares.forEach((flare, i) => {
            const particle = this.scene.add.particles(`flare${i}`);
            particle.setDepth(depthDictionary.flares);
            this.particles.push(particle);
        });
    }

    setGameToScreenMapper(mapper: GameToScreenMapper) {
        this.gameToScreenMapper = mapper;
    }

    renderBackground(
        windowWidth: number,
        windowHeight: number,
        trackLength: number,
        index: number,
        laneHeight: number,
        posY: number
    ) {
        // this.scene.cameras.main.backgroundColor.setTo(255, 255, 255);
        const repeats = Math.ceil(trackLength / (windowWidth / this.numberPlayers)) + 2;

        for (let i = 0; i < repeats; i++) {
            // Background without parallax
            const bg = this.scene.add.image((i * windowWidth) / this.numberPlayers, posY, 'laneBackground');
            const newWidth = this.calcWidthKeepAspectRatio(bg, laneHeight);
            bg.setDisplaySize(newWidth, laneHeight);
            bg.setOrigin(0, 1);
            bg.setScrollFactor(1);

            // set new positions, based on size of image
            bg.x = i * bg.displayWidth;
            if (this.numberPlayers <= 2) bg.y = this.moveLanesToCenter(windowHeight, laneHeight, index);

            this.backgroundLane?.push(bg);
        }
    }

    private calcWidthKeepAspectRatio(bg: Phaser.GameObjects.Image, laneHeight: number) {
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

    renderPlayer(
        idx: number,
        coordinates: Coordinates,
        monsterName: string,
        animationName: string,
        username?: string
    ): void {
        let usernameToDisplay = '';
        if (username) {
            usernameToDisplay = username;
        }

        if (!this.player) {
            this.renderPlayerInitially(coordinates, monsterName);
            this.initiatePlayerAnimation(monsterName, animationName);
            this.renderPlayerName(idx, usernameToDisplay, coordinates.y);
        } else if (this.player) {
            //only move player
            this.player.x = coordinates.x;
            // this.player.y = coordinates.y; //+ window.innerHeight / 20;
        }
    }

    // getPlayerYPosition(): number | undefined {
    //     return this.player?.y;
    // }
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

    stunPlayer() {
        if (this.player) this.player.alpha = 0.5;
    }

    unStunPlayer() {
        if (this.player) this.player.alpha = 1;
    }

    renderCave(posX: number, posY: number) {
        posX -= 30; // move the cave slightly to the left, so the monster runs fully into the cave
        // posY += 5;
        const scale = (0.47 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1];
        const yOffset = 2.2;
        const caveBehind = this.scene.physics.add.sprite(posX, posY, 'caveBehind'); //TODO change caveBehind to enum
        caveBehind.setScale(scale);
        caveBehind.setDepth(depthDictionary.cave);
        caveBehind.y -= caveBehind.displayHeight / yOffset; /// (0.01 * numberPlayers);

        const caveInFront = this.scene.physics.add.sprite(posX, posY, 'caveInFront'); //TODO change caveInFront to enum
        caveInFront.setScale(scale);
        caveInFront.setDepth(depthDictionary.caveInFront);
        caveInFront.y -= caveInFront.displayHeight / yOffset; //(0.01 * numberPlayers);
    }

    // handleLanePlayerDead(idx: number) {
    //     //TODO change later - no need to color images that have already gone past
    //     this.backgroundLane[idx].forEach(img => {
    //         // img.setAlpha(0.3);
    //         img.setTint(0x123a3a); //081919);
    //     });
    //     const yPos = this.backgroundLane[idx][0].y;
    //     const height = window.innerHeight / 4; //TODO change for variable number of lanes
    //     const fixedWidth = 1200;

    //     const text = this.scene.make.text({
    //         x: window.innerWidth / 2 - fixedWidth / 2,
    //         // x: this.scene.camera?.scrollX,
    //         y: yPos - height / 2,
    //         text: 'The mosquito caught you. Look at your phone!',
    //         style: {
    //             fontSize: `${35}px`,
    //             fontFamily: 'Roboto, Arial',
    //             // color: '#d2a44f',
    //             // stroke: '#d2a44f',
    //             color: '#d2a44f',
    //             stroke: '#d2a44f',
    //             strokeThickness: 1,
    //             fixedWidth,
    //             // fixedHeight,
    //             align: 'center',
    //             shadow: {
    //                 offsetX: 10,
    //                 offsetY: 10,
    //                 color: '#000',
    //                 blur: 0,
    //                 stroke: false,
    //                 fill: false,
    //             },
    //         },

    //         // origin: {x: 0.5, y: 0.5},
    //         add: true,
    //     });
    //     text.scrollFactorX = 0;
    // }

    renderObstacles(posX: number, posY: number, obstacleScale: number, obstacleType: string, depth: number) {
        const obstacle = this.scene.physics.add.sprite(posX, posY, obstacleType);
        // obstacle.y -= obstacle.displayHeight / 6;
        // obstacle.y -= obstacle.displayHeight / 2;
        // obstacle.y -= obstacle.displayHeight;

        obstacle.setScale(obstacleScale * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);
        obstacle.y -= obstacle.displayHeight / 1.3;
        obstacle.setDepth(depth);

        this.playerObstacles.push(obstacle);
    }

    renderFireworks(posX: number, posY: number, laneHeight: number) {
        // const flareColors: string[] = ['blue', 'red', 'green'];
        const scales: Array<number | { min: number; max: number }> = [0.1, 0.01, { min: 0, max: 0.1 }];
        const lifespans: number[] = [250, 500, 700];
        // const flareColo
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

    startRunningAnimation(animationName: string) {
        this.player?.play(animationName);
    }
    stopRunningAnimation() {
        this.player?.anims.stop();
    }

    movePlayerForward(newXPosition: number) {
        if (this.player) {
            this.player.x = newXPosition;
        }
    }

    destroyObstacle() {
        if (this.playerObstacles.length > 0) {
            this.playerObstacles[0].destroy();
            this.playerObstacles.shift();
        }
    }
    destroyObstacles() {
        this.playerObstacles.forEach(obstacle => {
            obstacle.destroy();
        });
    }

    destroyCave() {
        this.caveBehind?.destroy();
        this.caveInFront?.destroy();
    }

    destroyChaser() {
        this.chaser?.destroy();
    }

    addAttentionIcon() {
        if (!this.playerAttention && this.player) {
            this.playerAttention = this.scene.physics.add
                .sprite(this.player.x + 75, this.player.y - 50, 'attention')
                .setDepth(depthDictionary.attention)
                .setScale(0.03 * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);
        }
    }

    destroyAttentionIcon() {
        //TODO reuse
        this.playerAttention?.destroy();
        this.playerAttention = undefined;
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterName: string) {
        // eslint-disable-next-line no-console
        // console.log(' coordinates.y + window.innerHeight / 15');
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterName);
        this.player.setDepth(depthDictionary.player);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale((0.5 / this.numberPlayers) * this.laneHeightsPerNumberPlayers[this.numberPlayers - 1]);
        this.player.y = this.player.y - this.player.displayHeight / 2; //set correct y pos according to player height
    }

    private initiatePlayerAnimation(monsterName: string, animationName: string) {
        this.scene.anims.create({
            key: animationName,
            frames: this.scene.anims.generateFrameNumbers(monsterName, { start: 12, end: 15 }),
            frameRate: 6,
            repeat: -1,
        });
    }
}
