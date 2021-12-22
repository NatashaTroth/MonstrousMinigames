import Phaser from 'phaser';

import { depthDictionary } from '../../../../config/depthDictionary';
import SheepGameScene from '../../../game2/screen/components/SheepGameScene';

export class GameTwoRenderer {
    brightnessOverlay?: Phaser.GameObjects.Rectangle;

    constructor(private scene: SheepGameScene) { }

    renderBrightnessOverlay(width: number, height: number) {
        this.brightnessOverlay = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0);
        this.brightnessOverlay.setDepth(depthDictionary.brightnessOverlay);
        this.brightnessOverlay.setDisplaySize(width, height);
        this.brightnessOverlay.setOrigin(0, 0);
    }
    updateBrightnessOverlay(alpha: number) {
        this.brightnessOverlay?.setAlpha(alpha);
    }
}
