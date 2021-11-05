import { handleRenderWind, handleWindAnimation } from './PhaserPlayerRenderer';

describe('handleRenderWind', () => {
    const chaser = {
        x: 10,
        y: 20,
        displayHeight: 10,
        setScale: jest.fn(),
        setDepth: jest.fn(),
        play: jest.fn(),
        on: jest.fn(),
        destroy: jest.fn(),
    };
    const scene = {
        anims: {
            create: jest.fn(),
            generateFrameNumbers: jest.fn(),
        },
        physics: {
            add: {
                sprite: jest.fn(),
            },
        },
    };
    const numberPlayers = 2;
    const laneHeightsPerNumberPlayers = [10, 20];

    it('should create wind', () => {
        handleRenderWind(chaser, scene, numberPlayers, laneHeightsPerNumberPlayers);

        expect(scene.anims.generateFrameNumbers).toHaveBeenCalledWith('windSpritesheet', { start: 0, end: 5 });
    });
});

describe('handleWindAnimation', () => {
    const numberPlayers = 2;
    const laneHeightsPerNumberPlayers = [10, 20];
    const wind = {
        x: 10,
        y: 20,
        displayHeight: 10,
        setScale: jest.fn(),
        setDepth: jest.fn(),
        play: jest.fn(),
        on: jest.fn(),
        destroy: jest.fn(),
    };

    handleWindAnimation(wind, numberPlayers, laneHeightsPerNumberPlayers);
    expect(wind.play).toHaveBeenCalledWith('windAnimation');
});
