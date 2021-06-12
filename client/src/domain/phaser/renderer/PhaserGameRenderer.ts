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
        // for (let i = 0; i < 4; i++) {
        //     const tilesSprite = this.scene.add
        //         .tileSprite(
        //             0,
        //             i * (windowHeight / 4),
        //             trackLength * 100,
        //             this.scene.physics.world.bounds.height,
        //             'forestTile'
        //         )
        //         .setScale((windowHeight / 4) * 0.0025)
        //         .setOrigin(0, 0)
        //         .setScrollFactor(0);
        // }
        // eslint-disable-next-line no-console
        // console.log(trackLength);
        // // eslint-disable-next-line no-console
        // console.log(windowWidth);
        const reps = Math.ceil(trackLength / (windowWidth / 4)) + 1;
        for (let i = 0; i < reps; i++) {
            for (let j = 0; j < 4; j++) {
                const lane = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'forest2Smaller'
                );
                lane.setDisplaySize(windowWidth / 4, windowHeight / 4);
                lane.setOrigin(0, 1);
                lane.setScrollFactor(1);
            }
        }
    }

    renderPauseButton() {
        this.pauseButton = this.scene.add.text(window.innerWidth / 2, window.innerHeight - 50, 'Pause');
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => {
            this.scene.handlePauseResumeButton();
        });
    }

    pauseGame() {
        this.pauseButton?.setText('Resume');
    }

    resumeGame() {
        this.pauseButton?.setText('Pause');
    }
}
