import Phaser from 'phaser';

import { fireworkFlares } from '../../../components/Screen/GameAssets';
import MainScene from '../../../components/Screen/MainScene';
import { depthDictionary } from '../../../utils/depthDictionary';
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

    constructor(private scene: MainScene) {
        this.playerObstacles = [];
        this.particles = [];

        fireworkFlares.forEach((flare, i) => {
            const particle = this.scene.add.particles(`flare${i}`);
            particle.setDepth(depthDictionary.flares);
            this.particles.push(particle);
        });
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

    renderPlayer(
        coordinates: Coordinates,
        monsterName: string,
        animationName: string,
        username?: string,
        background?: string
    ): void {
        // eslint-disable-next-line no-console
        console.log(username);
        let usernameToDisplay = '';
        if (username) {
            usernameToDisplay = username;
        }

        if (!this.player) {
            this.renderPlayerInitially(coordinates, monsterName);
            this.initiatePlayerAnimation(monsterName, animationName);
            this.renderPlayerName(coordinates, usernameToDisplay);
        }
        if (this.player) {
            this.player.x = coordinates.x;
            this.player.y = coordinates.y + window.innerHeight / 16;
        }
    }

    renderPlayerName(coordinates: Coordinates, name: string) {
        this.playerNameBg = this.scene.add.rectangle(window.innerWidth, coordinates.y, 200, 50, 0x0, 0.5);
        this.playerName = this.scene.add.text(window.innerWidth, coordinates.y, name);
    }

    public updatePlayerNamePosition(newX: number) {
        this.playerNameBg?.setPosition(newX + window.innerWidth, this.playerNameBg.y);
        this.playerName?.setPosition(newX + window.innerWidth - 100, this.playerName.y);
    }

    renderGoal(posX: number, posY: number) {
        posX -= 30; // move the cave slightly to the left, so the monster runs fully into the cave
        posY += 5;
        const scale = 0.13;
        const caveBehind = this.scene.physics.add.sprite(posX, posY, 'caveBehind'); //TODO change caveBehind to enum
        caveBehind.setScale(scale, scale);
        caveBehind.setDepth(depthDictionary.cave);
        const caveInFront = this.scene.physics.add.sprite(posX, posY, 'caveInFront'); //TODO change caveInFront to enum
        caveInFront.setScale(scale, scale);
        caveInFront.setDepth(depthDictionary.caveInFront);
    }

    // renderText(coordinates: Coordinates, text: string, background?: string): void {
    //     this.playerText?.destroy(); // TODO: maybe reuse existing text (see renderPlayer)
    //     this.playerText = this.scene.add
    //         .text(
    //             coordinates.x, //+ 50
    //             coordinates.y - 100,
    //             text,
    //             { font: '16px Arial', align: 'center', fixedWidth: 150 }
    //         )
    //         .setDepth(50);

    //     if (background) {
    //         this.playerText.setBackgroundColor(background);
    //     }
    // }

    renderObstacles(posX: number, posY: number, obstacleScale: number, obstacleType: string, depth: number) {
        const obstacle = this.scene.physics.add.sprite(posX, posY, obstacleType);
        obstacle.setScale(obstacleScale, obstacleScale);
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

    destroyChaser() {
        this.chaser?.destroy();
    }

    addAttentionIcon() {
        if (!this.playerAttention && this.player) {
            this.playerAttention = this.scene.physics.add
                .sprite(this.player.x + 75, this.player.y - 100, 'attention')
                .setDepth(depthDictionary.attention)
                .setScale(0.03, 0.03);
        }
    }

    destroyAttentionIcon() {
        //TODO reuse
        this.playerAttention?.destroy();
        this.playerAttention = undefined;
    }

    private renderPlayerInitially(coordinates: Coordinates, monsterName: string) {
        // eslint-disable-next-line no-console
        console.log(window.devicePixelRatio / 3);
        this.player = this.scene.physics.add.sprite(
            coordinates.x,
            coordinates.y + window.innerHeight / 16,
            monsterName
        );
        this.player.setDepth(depthDictionary.player);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(0.15, 0.15);
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
