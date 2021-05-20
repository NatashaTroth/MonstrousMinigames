import Phaser from 'phaser';

import { Coordinates, PlayerRenderer } from './PlayerRenderer';

/**
 * this is an incomplete PlayerRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserPlayerRenderer implements PlayerRenderer {
    private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    // private playerText?: Phaser.GameObjects.Text;
    private playerObstacles: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[];
    private playerAttention?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(private scene: Phaser.Scene) {
        this.playerObstacles = [];
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

    addAttentionIcon() {
        if (!this.playerAttention && this.player) {
            this.playerAttention = this.scene.physics.add
                .sprite(this.player.x + 75, this.player.y - 150, 'attention')
                .setDepth(100)
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

        this.player.setDepth(50);
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
