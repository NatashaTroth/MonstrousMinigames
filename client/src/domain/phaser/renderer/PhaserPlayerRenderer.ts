import Phaser from 'phaser';

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
    private particles: Phaser.GameObjects.Particles.ParticleEmitterManager;

    constructor(private scene: MainScene) {
        this.playerObstacles = [];
        this.particles = this.scene.add.particles('flares');
        this.particles.setDepth(depthDictionary.flares);
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

    renderPlayer(coordinates: Coordinates, monsterName: string, animationName: string, background?: string): void {
        if (!this.player) {
            this.renderPlayerInitially(coordinates, monsterName);
            this.initiatePlayerAnimation(monsterName, animationName);
        }
        if (this.player) {
            this.player.x = coordinates.x;
            this.player.y = coordinates.y;
        }
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
        const particlesEmitter = this.particles.createEmitter({
            frame: ['red', 'green', 'blue'],
            x: posX,
            y: posY,
            angle: { min: 200, max: 250 },
            speed: { min: 0, max: -500 },
            gravityY: 200,
            lifespan: 500,
            scale: 0.1,
            blendMode: 'ADD',
        });

        particlesEmitter.on = true;
        setTimeout(() => (particlesEmitter.on = false), 900);
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
                .sprite(this.player.x + 75, this.player.y - 150, 'attention')
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
        this.player = this.scene.physics.add.sprite(coordinates.x, coordinates.y, monsterName);

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
