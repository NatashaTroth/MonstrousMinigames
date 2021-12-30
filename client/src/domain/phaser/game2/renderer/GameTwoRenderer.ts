/* eslint-disable no-console */
import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';
import * as colors from '../../colors';
import { loadingTextStyleProperties } from '../../textStyleProperties';

export class GameTwoRenderer {
    brightnessOverlay?: Phaser.GameObjects.Rectangle;
    guessText?: Phaser.GameObjects.Text;
    guessInstructionText?: Phaser.GameObjects.Text;

    constructor(private scene: SheepGameScene) {}

    renderBrightnessOverlay(width: number, height: number) {
        this.brightnessOverlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 1);
        this.brightnessOverlay.setDepth(depthDictionary.brightnessOverlay);
        this.brightnessOverlay.setDisplaySize(width, height);
        this.brightnessOverlay.setOrigin(0, 0);
        this.brightnessOverlay.setAlpha(0);
    }
    updateBrightnessOverlay(brightness: number) {
        this.brightnessOverlay?.setAlpha(1 - brightness / 100);
    }

    renderGuessText(show: boolean) {
        // TODO: formatting
        if (show) {
            if (!this.guessInstructionText) {
                const screenCenterWidth = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
                const screenCenterHeight = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
                this.guessInstructionText = this.scene.make.text({
                    x: screenCenterWidth,
                    y: screenCenterHeight - 50,
                    text: 'How many sheep are there?\nEnter your guess on your device.',
                    style: {
                        ...loadingTextStyleProperties,
                        fontSize: `${40}px`,
                        color: colors.orange,
                        fontStyle: 'bold',
                    },
                });
                this.guessInstructionText.setOrigin(0.5);
                this.guessInstructionText.setDepth(depthDictionary.percentText);
            } else {
                this.guessInstructionText.setVisible(true);
            }
        } else {
            this.guessInstructionText?.setVisible(false);
        }
    }

    renderSheepBackground(x: number, y: number, width: number, height: number) {
        const element = this.scene.add.image(x, y, 'sheepGrass');
        element.setDisplaySize(width, height);
        element.setOrigin(0, 0);
        element.setDepth(depthDictionary.sky);
    }
}
