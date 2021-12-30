import { handleRenderCountdown } from '../../domain/phaser/renderer/PhaserGameRenderer';

describe('handleRenderCountdown', () => {
    it('should set given text if countdown text already exists', () => {
        const countdownText = {
            scrollFactorX: 10,
            setText: jest.fn(),
            setDepth: jest.fn(),
        };
        const newText = 'New Text';
        const scene = {
            windowHeight: 100,
            windowWidth: 100,
            anims: {
                create: jest.fn(),
                generateFrameNumbers: jest.fn(),
            },
            physics: {
                add: {
                    sprite: jest.fn(),
                },
            },
            make: {
                text: jest.fn(),
            },
        };
        handleRenderCountdown(scene, countdownText, newText);

        expect(countdownText.setText).toHaveBeenCalledWith(newText);
    });

    it('should create new text if countdown text does not exist', () => {
        const newText = 'New Text';
        const scene = {
            windowHeight: 100,
            windowWidth: 100,
            anims: {
                create: jest.fn(),
                generateFrameNumbers: jest.fn(),
            },
            physics: {
                add: {
                    sprite: jest.fn(),
                },
            },
            make: {
                text: jest.fn(),
            },
        };

        scene.make.text.mockReturnValue({
            scrollFactorX: 10,
            setText: jest.fn(),
            setDepth: jest.fn(),
        });
        handleRenderCountdown(scene, undefined, newText);

        expect(scene.make.text).toHaveBeenCalledTimes(1);
    });
});
