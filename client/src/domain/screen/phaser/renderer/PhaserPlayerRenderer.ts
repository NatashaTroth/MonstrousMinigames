import Phaser from 'phaser';

import { depthDictionary } from '../../../../utils/depthDictionary';
import { fireworkFlares } from '../../components/GameAssets';
import MainScene from '../../components/MainScene';
import printMethod from '../printMethod';
import { Coordinates, PlayerRenderer } from './PlayerRenderer';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserPlayerRenderer implements PlayerRenderer {
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

    constructor(private scene: MainScene) {
        this.playerObstacles = [];
        this.particles = [];
        this.backgroundLane = []; //TODO change

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
        numberPlayers: number,
        index: number
    ) {
        //TODO move lanes to player renderer
        this.scene.cameras.main.backgroundColor.setTo(255, 255, 255);
        const reps = Math.ceil(trackLength / (windowWidth / numberPlayers)) + 2;

        for (let i = 0; i < reps; i++) {
            // for (let j = 0; j < numberPlayers; j++) {
            // Background without parallax
            const bg = this.scene.add.image(
                (i * windowWidth) / numberPlayers,
                (index * windowHeight) / numberPlayers + windowHeight / numberPlayers,
                'laneBackground'
            );
            // bg.setDisplaySize(windowWidth / numberPlayers, windowHeight / numberPlayers);
            const oldHeight = bg.displayHeight;
            const newHeight = windowHeight / numberPlayers;

            // oldHeight .... 100%
            // newHeight ... x -> 100 / oldHeight * newHeight
            // ---
            // 100% ...... oldWidth
            // x ......... newWidth -> oldWidth/100 * x

            const backgroundScalingFactor = (100 / oldHeight) * newHeight;
            const newWidth = (bg.displayWidth / 100) * backgroundScalingFactor;
            bg.setDisplaySize(newWidth, newHeight);
            bg.setOrigin(0, 1);
            bg.setScrollFactor(1);
            bg.x = i * bg.displayWidth;
            this.backgroundLane?.push(bg);
        }

        // const playerNameBg = this.scene.add.rectangle(50, window.innerHeight / numberPlayers - 25, 250, 50, 0xb63bd4, 0.7);
        // // this.playerName = this.scene.add.text(100, window.innerHeight /numberPlayers - 20, 'lsjhdf');

        // const playerName = this.scene.make.text({
        //     x: 50,
        //     // x: this.scene.camera?.scrollX,
        //     y: window.innerHeight / numberPlayers - 30,
        //     text: ' skjhdf',
        //     style: {
        //         fontSize: `${16}px`,
        //         fontFamily: 'Roboto, Arial',
        //         // color: '#d2a44f',
        //         // stroke: '#d2a44f',
        //         color: '#fff',
        //         // stroke: '#d2a44f',
        //         // strokeThickness: 1,
        //         // fixedWidth,
        //         // fixedHeight,
        //         // align: 'left',
        //         // shadow: {
        //         //     offsetX: 10,
        //         //     offsetY: 10,
        //         //     color: '#000',
        //         //     blur: 0,
        //         //     stroke: false,
        //         //     fill: false,
        //         // },
        //     },

        //     // origin: {x: 0.5, y: 0.5},
        //     add: true,
        // });
        // playerName.setPadding(0, 0, 0, 40);

        // playerNameBg.setDepth(depthDictionary.nameTag);
        // playerName.setDepth(depthDictionary.nameTag);
    }

    renderPlayer(
        idx: number,
        coordinates: Coordinates,
        monsterName: string,
        animationName: string,
        numberPlayers: number,
        username?: string
    ): void {
        // eslint-disable-next-line no-console
        // console.log(username);
        let usernameToDisplay = '';
        if (username) {
            usernameToDisplay = username;
        }

        if (!this.player) {
            this.renderPlayerInitially(coordinates, monsterName, numberPlayers);
            this.initiatePlayerAnimation(monsterName, animationName);
            this.renderPlayerName(idx, usernameToDisplay, numberPlayers);
        } else if (this.player) {
            //move player
            this.player.x = coordinates.x;
            this.player.y = coordinates.y; //+ window.innerHeight / 20;
        }
    }

    private renderPlayerName(idx: number, name: string, numberPlayers: number) {
        this.playerNameBg = this.scene.add.rectangle(
            50,
            (window.innerHeight / numberPlayers) * (idx + 1) - 25,
            250,
            50,
            0xb63bd4,
            0.7
        );
        // this.playerName = this.scene.add.text(100, window.innerHeight / numberPlayers - 20, 'lsjhdf');

        this.playerName = this.scene.make.text({
            x: 20,
            // x: this.scene.camera?.scrollX,
            y: (window.innerHeight / numberPlayers) * (idx + 1) - 30,
            text: `${name}`, //TODO QUICKFIX - GET PADDING TO WORK INSTEAD OF SPACE
            style: {
                fontSize: `${16}px`,
                fontFamily: 'Roboto, Arial',
                // color: '#d2a44f',
                // stroke: '#d2a44f',
                color: '#fff',
                // stroke: '#d2a44f',
                // strokeThickness: 1,
                // fixedWidth,
                // fixedHeight,
                // align: 'left',
                // shadow: {
                //     offsetX: 10,
                //     offsetY: 10,
                //     color: '#000',
                //     blur: 0,
                //     stroke: false,
                //     fill: false,
                // },
            },

            // origin: {x: 0.5, y: 0.5},
            add: true,
        });
        // this.playerName.setPadding(0, 0, 0, 50);

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
            this.chaser.setScale(0.4, 0.4);
            this.chaser.setDepth(depthDictionary.chaser);
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

    renderCave(posX: number, posY: number, numberPlayers: number) {
        printMethod(numberPlayers);
        posX -= 30; // move the cave slightly to the left, so the monster runs fully into the cave
        // posY += 5;
        const scale = 0.52 / numberPlayers;
        const caveBehind = this.scene.physics.add.sprite(posX, posY, 'caveBehind'); //TODO change caveBehind to enum
        caveBehind.setScale(scale);
        caveBehind.setDepth(depthDictionary.cave);
        caveBehind.y -= caveBehind.displayHeight / 2.2; /// (0.01 * numberPlayers);

        const caveInFront = this.scene.physics.add.sprite(posX, posY, 'caveInFront'); //TODO change caveInFront to enum
        caveInFront.setScale(scale);
        caveInFront.setDepth(depthDictionary.caveInFront);
        caveInFront.y -= caveInFront.displayHeight / 2.2; //(0.01 * numberPlayers);
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

    renderObstacles(
        posX: number,
        posY: number,
        obstacleScale: number,
        obstacleType: string,
        depth: number,
        numberPlayers: number
    ) {
        const obstacle = this.scene.physics.add.sprite(posX, posY, obstacleType);
        // obstacle.y -= obstacle.displayHeight / 6;
        obstacle.y -= obstacle.displayHeight / (2 * numberPlayers);
        obstacle.setScale(obstacleScale);
        obstacle.setDepth(depth);

        this.playerObstacles.push(obstacle);
    }

    renderFireworks(posX: number, posY: number) {
        // const flareColors: string[] = ['blue', 'red', 'green'];
        const scales: Array<number | { min: number; max: number }> = [0.1, 0.01, { min: 0, max: 0.1 }];
        const lifespans: number[] = [250, 500, 700];
        // const flareColo
        this.particles.forEach((particle, i) => {
            const particlesEmitter = particle.createEmitter({
                // key: flare,
                x: posX,
                y: posY,
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
                .setScale(0.03, 0.03);
        }
    }

    destroyAttentionIcon() {
        //TODO reuse
        this.playerAttention?.destroy();
        this.playerAttention = undefined;
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterName: string, numberPlayers: number) {
        // eslint-disable-next-line no-console
        // console.log(' coordinates.y + window.innerHeight / 15');
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterName);
        this.player.setDepth(depthDictionary.player);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.5 / numberPlayers);
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
