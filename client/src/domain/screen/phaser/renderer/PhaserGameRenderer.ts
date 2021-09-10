import Phaser from 'phaser';

import { depthDictionary } from '../../../../utils/depthDictionary';
import MainScene from '../../components/MainScene';

/**
 * this is an incomplete GameRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserGameRenderer {
    countdownText?: Phaser.GameObjects.Text;

    constructor(private scene: MainScene) {
        this.scene = scene;
    }

    renderCountdown(text: string) {
        const fixedWidth = 800;
        const fixedHeight = 200;
        const x = window.innerWidth / 2 - fixedWidth / 2;
        const y = window.innerHeight / 2 - fixedHeight / 2;

        if (this.countdownText) {
            this.countdownText.setText(text);
        } else {
            this.countdownText = this.scene.make.text({
                x,
                y,
                text,
                style: {
                    fontSize: `${fixedHeight}px`,
                    fontFamily: 'Roboto, Arial',
                    color: '#d2a44f',
                    stroke: '#d2a44f',
                    strokeThickness: 15,
                    fixedWidth,
                    fixedHeight,
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

                add: true,
            });
            this.countdownText.scrollFactorX = 0;
            this.countdownText.setDepth(depthDictionary.countdown);
        }
    }

    destroyCountdown() {
        this.countdownText?.destroy();
    }
}
