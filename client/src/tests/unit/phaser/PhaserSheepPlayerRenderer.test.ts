import { handleRenderPlayer } from '../../../domain/phaser/game2/renderer/PhaserPlayerRenderer';
import { character } from './PlayerTestData';

describe('handleRenderPlayer SheepGame', () => {
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

    scene.physics.add.sprite.mockReturnValue({
        x: 10,
        y: 20,
        displayHeight: 10,
        setScale: jest.fn(),
        setDepth: jest.fn(),
        play: jest.fn(),
        on: jest.fn(),
        destroy: jest.fn(),
        setBounce: jest.fn(),
        setCollideWorldBounds: jest.fn(),
    });

    it('renders player', () => {
        handleRenderPlayer(scene, { x: 0, y: 0 }, character.name, 1000);

        expect(scene.physics.add.sprite).toHaveBeenCalledWith(0, 0, character.name);
    });
});
