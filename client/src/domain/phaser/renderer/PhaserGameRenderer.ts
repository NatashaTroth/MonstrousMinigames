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
        const reps = Math.ceil(trackLength / (windowWidth / 4)) + 1;
        for (let i = 0; i < reps; i++) {
            for (let j = 0; j < 4; j++) {
                const sky = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'starsAndSky'
                );

                const mountains = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'mountains'

                );
                const hills = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'hills'
                );

                const trees = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'trees'
                );

                const floor = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'floor'
                );

                sky.setDisplaySize(windowWidth / 4, windowHeight / 4);
                mountains.setDisplaySize(windowWidth / 4, windowHeight / 4);
                hills.setDisplaySize(windowWidth / 4, windowHeight / 4);
                trees.setDisplaySize(windowWidth / 4, windowHeight / 4);
                floor.setDisplaySize(windowWidth / 4, windowHeight / 4);

                sky.setOrigin(0, 1);
                mountains.setOrigin(0,1)
                hills.setOrigin(0,1)
                trees.setOrigin(0,1)
                floor.setOrigin(0,1)

                sky.setScrollFactor(0);
                mountains.setScrollFactor(0.25)
                hills.setScrollFactor(0.5)
                trees.setScrollFactor(0.75)
                floor.setScrollFactor(1)
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
