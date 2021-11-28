import {
    handleRenderPlayer,
    handleRenderWind,
    handleWindAnimation,
} from '../../domain/phaser/game1/renderer/PhaserPlayerRenderer';

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
        setBounce: jest.fn(),
        setCollideWorldBounds: jest.fn(),
    };
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

    const numberPlayers = 2;
    const laneHeightsPerNumberPlayers = [10, 20];

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

    it('should create wind', () => {
        handleRenderWind(chaser, scene, numberPlayers, laneHeightsPerNumberPlayers);

        expect(scene.anims.generateFrameNumbers).toHaveBeenCalledWith('windSpritesheet', expect.anything());
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
        setBounce: jest.fn(),
        setCollideWorldBounds: jest.fn(),
    };

    handleWindAnimation(wind, numberPlayers, laneHeightsPerNumberPlayers);
    expect(wind.play).toHaveBeenCalledWith('windAnimation');
});

describe('handleRenderPlayer', () => {
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
    const numberPlayers = 2;
    const laneHeightsPerNumberPlayers = [10, 20];
    const coordinates = { x: 10, y: 20 };
    const monsterSpriteSheetName = 'Susi';

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

    it('should create player', () => {
        handleRenderPlayer(scene, numberPlayers, laneHeightsPerNumberPlayers, coordinates, monsterSpriteSheetName);

        expect(scene.physics.add.sprite).toHaveBeenCalledWith(
            coordinates.x,
            coordinates.y,
            monsterSpriteSheetName,
            expect.anything()
        );
    });
});
