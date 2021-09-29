//TODO can be used by all phaser games!!

import Phaser from 'phaser';

import { designDevelopment } from '../../../../../utils/constants';
import { depthDictionary } from '../../../../../utils/depthDictionary';
import { getRandomInt } from '../../../../../utils/getRandomInt';
import MainScene from '../../components/MainScene';
import * as colors from '../colors';
import { gameLoadedWaitingMessages, gameLoadingMessages } from '../gameLoadingMessages';
import { countdownTextStyleProperties, loadingTextStyleProperties } from '../textStyleProperties';

/**
 * this is an incomplete GameRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserGameRenderer {
    sceneWidth: number;
    sceneHeight: number;
    progressBoxWidth: number;
    progressBoxHeight: number;
    countdownText?: Phaser.GameObjects.Text;
    progressBox?: Phaser.GameObjects.Graphics;
    progressBar?: Phaser.GameObjects.Graphics;
    loadingText?: Phaser.GameObjects.Text;
    percentText?: Phaser.GameObjects.Text;
    assetText?: Phaser.GameObjects.Text; //only for local dev -> to see which assets take long to load

    constructor(private scene: MainScene) {
        this.scene = scene;
        this.sceneWidth = this.scene.cameras.main.width;
        this.sceneHeight = this.scene.cameras.main.height;
        this.progressBoxWidth = 320;
        this.progressBoxHeight = 50;
    }

    renderCountdown(text: string) {
        const fixedWidth = 800;
        const fixedHeight = 200;
        const x = this.scene.windowWidth / 2 - fixedWidth / 2;
        const y = this.scene.windowHeight / 2 - fixedHeight / 2;

        if (this.countdownText) {
            this.countdownText.setText(text);
        } else {
            this.countdownText = this.scene.make.text({
                x,
                y,
                text,
                style: {
                    ...countdownTextStyleProperties,
                    fontSize: `${fixedHeight}px`,
                    fixedWidth,
                    fixedHeight,
                },
                add: true,
            });
            this.countdownText.scrollFactorX = 0;
            this.countdownText.setDepth(depthDictionary.countdown);
        }
    }

    renderLoadingScreen() {
        //progress bar: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13#Loading_Our_Assets

        //loading bar
        this.progressBar = this.scene.add.graphics();
        this.progressBox = this.scene.add.graphics();
        this.progressBox.fillStyle(0xa7bdb1);
        this.progressBox.setDepth(depthDictionary.progressBox);

        const screenCenterWidth = this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
        const screenCenterHeight = this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
        const progressBoxXPos = this.sceneWidth / 2 - this.progressBoxWidth / 2;
        const progressBoxYPos = this.sceneHeight / 2 - this.progressBoxHeight / 2;
        this.progressBox.fillRect(progressBoxXPos, progressBoxYPos, this.progressBoxWidth, this.progressBoxHeight);

        this.loadingText = this.scene.make.text({
            x: screenCenterWidth,
            y: screenCenterHeight - this.progressBoxHeight,
            text: `${gameLoadingMessages[getRandomInt(0, gameLoadingMessages.length)]}...`,
            style: {
                ...loadingTextStyleProperties,
                fontSize: `${20}px`,
            },
        });
        this.loadingText.setOrigin(0.5);

        //loading percentage
        this.percentText = this.scene.make.text({
            x: screenCenterWidth,
            y: screenCenterHeight,
            text: '0%',
            style: {
                ...loadingTextStyleProperties,
                fontSize: `${18}px`,
                color: colors.darkTreeGreen,
                fontStyle: 'bold',
            },
        });
        this.percentText.setOrigin(0.5);
        this.percentText.setDepth(depthDictionary.percentText);

        if (designDevelopment) {
            //asset text
            this.assetText = this.scene.make.text({
                x: this.sceneWidth / 2,
                y: this.sceneHeight / 2 + 50,
                text: '',
                style: {
                    ...loadingTextStyleProperties,
                },
            });
            this.assetText.setOrigin(0.5, 0.5);
        }
    }

    updateLoadingScreenPercent(value: number) {
        this.percentText?.setText(`${Math.round(value * 100)}%`);

        this.progressBar?.clear();
        this.progressBar?.fillStyle(0xd2a44f, 1);
        this.progressBar?.fillRect(
            this.sceneWidth / 2 - this.progressBoxWidth / 2 + 10,
            this.sceneHeight / 2 - this.progressBoxHeight / 2 + 10,
            300 * value,
            30
        );
        this.progressBar?.setDepth(depthDictionary.progressBar);
    }

    updateLoadingScreenFinishedPreloading() {
        this.loadingText?.setText(`${gameLoadedWaitingMessages[getRandomInt(0, gameLoadedWaitingMessages.length)]}...`);
    }

    //only for local development
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileProgressUpdate(file: any) {
        this.assetText?.setText(`Loading asset: ${file.src}`);
    }

    destroyLoadingScreen() {
        this.loadingText?.destroy();
        this.percentText?.destroy();
        this.progressBox?.destroy();
        this.progressBar?.destroy();
        if (designDevelopment) this.assetText?.destroy();
    }

    destroyCountdown() {
        this.countdownText?.destroy();
    }
}
