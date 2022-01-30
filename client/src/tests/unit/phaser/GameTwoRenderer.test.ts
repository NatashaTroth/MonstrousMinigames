import SheepGameScene from '../../../domain/game2/screen/components/SheepGameScene';
import { GameTwoRenderer } from '../../../domain/phaser/game2/renderer/GameTwoRenderer';

describe('handleRenderCountdown', () => {
    it('updateBrightness', () => {
        const scene = new SheepGameScene();
        const renderer = new GameTwoRenderer(scene);
        expect(renderer.getNewBrightness(50)).toEqual(0.5);
    });
});
