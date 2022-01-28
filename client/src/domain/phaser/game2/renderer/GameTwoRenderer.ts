/* eslint-disable no-console */
import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';
import * as colors from '../../colors';
import { loadingTextStyleProperties } from '../../textStyleProperties';

export class GameTwoRenderer {
    brightnessOverlay?: Phaser.GameObjects.Rectangle;
    guessInstructionText?: Phaser.GameObjects.Text;
    roundText?: Phaser.GameObjects.Text;
    sheepCountText?: Phaser.GameObjects.Text;

    constructor(private scene: SheepGameScene) {}

    renderBrightnessOverlay(width: number, height: number) {
        this.brightnessOverlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 1);
        this.brightnessOverlay.setDepth(depthDictionary.brightnessOverlay);
        this.brightnessOverlay.setDisplaySize(width, height);
        this.brightnessOverlay.setOrigin(0, 0);
        this.brightnessOverlay.setAlpha(0);
    }

    updateBrightnessOverlay(brightness: number) {
        this.brightnessOverlay?.setAlpha(this.getNewBrightness(brightness));
    }

    getNewBrightness(brightness: number) {
        return 1 - brightness / 100;
    }

    renderRoundCount(round: number) {
        if (this.roundText) {
            this.roundText.setText(`Round ${round}`);
        } else {
            const screenCenterWidth = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
            const screenCenterHeight = this.scene.cameras.main.worldView.y + 50;
            this.roundText = this.scene.make.text({
                x: screenCenterWidth,
                y: screenCenterHeight,
                text: `Round ${round}`,
                style: {
                    ...loadingTextStyleProperties,
                    fontSize: `30px`,
                    color: colors.orange,
                    fontStyle: 'bold',
                },
            });
            this.roundText.setOrigin(0.5);
            this.roundText.setDepth(depthDictionary.percentText);
        }
    }

    renderGuessText(show: boolean) {
        if (show) {
            if (!this.guessInstructionText) {
                const screenCenterWidth = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
                const screenCenterHeight = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
                this.guessInstructionText = this.scene.make.text({
                    x: screenCenterWidth,
                    y: screenCenterHeight - 50,
                    text: 'How many sheep are on the meadow?\nEnter your guess on your device.',
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
        const element = this.scene.add.image(x, y, 'sheepBackground');
        // const element = this.scene.add.image(x, y, 'sheepGrass');
        element.setDisplaySize(width, height);
        element.setOrigin(0, 0);
        element.setDepth(depthDictionary.game2Bg);
    }

    renderInitialSheepCount(count: number) {
        const screenCenterWidth = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
        const screenCenterHeight = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
        this.sheepCountText = this.scene.make.text({
            x: screenCenterWidth,
            y: screenCenterHeight - 50,
            text: `${count} sheeps are on the meadow`,
            style: {
                ...loadingTextStyleProperties,
                fontSize: `${60}px`,
                color: colors.black,
                fontStyle: 'bold',
                backgroundColor: colors.orange,
            },
        });
        this.sheepCountText.setPadding(10);
        this.sheepCountText.setOrigin(0.5);
        this.sheepCountText.setDepth(depthDictionary.percentText);
    }

    destroyInitialSheepCount() {
        this.sheepCountText?.destroy();
    }
}
