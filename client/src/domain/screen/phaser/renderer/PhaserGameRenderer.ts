import Phaser from 'phaser';

import { depthDictionary } from '../../../../utils/depthDictionary';
import MainScene from '../../components/MainScene';
import { GameRenderer } from './GameRenderer';

/**
 * this is an incomplete GameRenderer adapter which contains all the phaser logic. This class might only be tested via
 * integration tests. That's why we want to keep this class as small as possible.
 */
export class PhaserGameRenderer implements GameRenderer {
    pauseButton?: Phaser.GameObjects.Text;
    countdownText?: Phaser.GameObjects.Text;
    backgroundLanes: Phaser.GameObjects.Image[][];

    constructor(private scene: MainScene) {
        this.scene = scene;
        this.backgroundLanes = [[], [], [], []]; //TODO change
    }

    renderBackground(windowWidth: number, windowHeight: number, trackLength: number) {
        //TODO move lanes to player renderer
        this.scene.cameras.main.backgroundColor.setTo(255, 255, 255);
        const reps = Math.ceil(trackLength / (windowWidth / 4)) + 2;

        for (let i = 0; i < reps; i++) {
            for (let j = 0; j < 4; j++) {
                // Background without parallax
                const bg = this.scene.add.image(
                    (i * windowWidth) / 4,
                    (j * windowHeight) / 4 + windowHeight / 4,
                    'laneBackground'
                );
                bg.setDisplaySize(windowWidth / 4, windowHeight / 4);
                bg.setOrigin(0, 1);
                bg.setScrollFactor(1);

                /*
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
                mountains.setOrigin(0, 1);
                hills.setOrigin(0, 1);
                trees.setOrigin(0, 1);
                floor.setOrigin(0, 1);

                sky.setScrollFactor(0);
                mountains.setScrollFactor(0.25)
                hills.setScrollFactor(0.5)
                trees.setScrollFactor(0.75)
                floor.setScrollFactor(1) */

                this.backgroundLanes[j].push(bg);
            }
        }

        // const playerNameBg = this.scene.add.rectangle(50, window.innerHeight / 4 - 25, 250, 50, 0xb63bd4, 0.7);
        // // this.playerName = this.scene.add.text(100, window.innerHeight / 4 - 20, 'lsjhdf');

        // const playerName = this.scene.make.text({
        //     x: 50,
        //     // x: this.scene.camera?.scrollX,
        //     y: window.innerHeight / 4 - 30,
        //     text: ' skjhdf',
        //     style: {
        //         fontSize: `${16}px`,
        //         fontFamily: 'Roboto, Arial',
        //         // color: '#d2a44f',
        //         // stroke: '#d2a44f',
        //         color: '#fff',
        //         // stroke: '#d2a44f',
        //         // strokeThickness: 1,
        //         // fixedWidth,
        //         // fixedHeight,
        //         // align: 'left',
        //         // shadow: {
        //         //     offsetX: 10,
        //         //     offsetY: 10,
        //         //     color: '#000',
        //         //     blur: 0,
        //         //     stroke: false,
        //         //     fill: false,
        //         // },
        //     },

        //     // origin: {x: 0.5, y: 0.5},
        //     add: true,
        // });
        // playerName.setPadding(0, 0, 0, 40);

        // playerNameBg.setDepth(depthDictionary.nameTag);
        // playerName.setDepth(depthDictionary.nameTag);
    }

    handleLanePlayerDead(idx: number) {
        //TODO change later - no need to color images that have already gone past
        this.backgroundLanes[idx].forEach(img => {
            // img.setAlpha(0.3);
            img.setTint(0x123a3a); //081919);
        });
        const yPos = this.backgroundLanes[idx][0].y;
        const height = window.innerHeight / 4; //TODO change for variable number of lanes
        const fixedWidth = 1200;

        const text = this.scene.make.text({
            x: window.innerWidth / 2 - fixedWidth / 2,
            // x: this.scene.camera?.scrollX,
            y: yPos - height / 2,
            text: 'The mosquito caught you. Look at your phone!',
            style: {
                fontSize: `${35}px`,
                fontFamily: 'Roboto, Arial',
                // color: '#d2a44f',
                // stroke: '#d2a44f',
                color: '#d2a44f',
                stroke: '#d2a44f',
                strokeThickness: 1,
                fixedWidth,
                // fixedHeight,
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

            // origin: {x: 0.5, y: 0.5},
            add: true,
        });
        text.scrollFactorX = 0;
    }

    renderPauseButton() {
        this.pauseButton = this.scene.add.text(window.innerWidth / 2, window.innerHeight - 50, 'Pause');
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => {
            this.scene.handlePauseResumeButton();
        });
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

                // origin: {x: 0.5, y: 0.5},
                add: true,
            });
            this.countdownText.scrollFactorX = 0;
            this.countdownText.setDepth(depthDictionary.countdown);
        }
    }

    destroyCountdown() {
        this.countdownText?.destroy();
    }

    pauseGame() {
        this.pauseButton?.setText('Resume');
    }

    resumeGame() {
        this.pauseButton?.setText('Pause');
    }
}
