import Phaser from 'phaser';

import MainScene from '../../../components/Screen/MainScene';
import { GameRenderer } from './GameRenderer';

/**
 * this is an incomplete GameRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserGameRenderer implements GameRenderer {
    pauseButton?: Phaser.GameObjects.Text;

    constructor(private scene: MainScene) {
        this.scene = scene;
    }

    renderBackground(windowWidth: number, windowHeight: number, trackLength: number) {
        const reps = trackLength / (windowWidth / 4);
        for (let i = 0; i < reps; i++) {
            for (let j = 0; j < 4; j++) {
                const lane = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'forest2'
                );
                lane.setDisplaySize(windowWidth / 4, windowHeight / 4);
                lane.setOrigin(0, 1);
                lane.setScrollFactor(1);
            }
        }
    }

    //TODO
    // setGoal(playerIndex: number) {
    //     const goal = this.physics.add.sprite(this.trackLength, this.getYPosition(playerIndex), 'goal');
    //     goal.setScale(0.1, 0.1);
    //     goals.push(goal);
    // }
}
