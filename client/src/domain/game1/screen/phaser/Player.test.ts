import { GameState, ObstacleTypes } from "../../../../utils/constants";
import {
    InMemoryPlayerRenderer
} from "../../../phaserTestHelper/playerRenderer/InMemoryPlayerRenderer";
import MainScene from "../components/MainScene";
import { AnimationName } from "./enums";
import { CharacterAnimation } from "./gameInterfaces";
import { GameToScreenMapper } from "./GameToScreenMapper";
import { Player } from "./Player";

describe('Player Renderer Initial', () => {
    const numberPlayers = 2;
    const laneHeight = 100;
    const index = 0;
    const character = {
        name: 'mock',
        file: 'test',
        animations: new Map<AnimationName, CharacterAnimation>([]),
        properties: {
            frameWidth: 10,
            frameHeight: 10,
        },
    };
    const laneHeightsPerNumberPlayers = [10];
    const posY = 200;
    const scene = new MainScene();
    const gameToScreenMapper = new GameToScreenMapper(200, 500);

    const gameStateData = {
        gameState: GameState.started,
        numberOfObstacles: 4,
        playersState: [
            {
                dead: false,
                atObstacle: false,
                finished: false,
                finishedTimeMs: 0,
                id: '1',
                isActive: true,
                name: 'Mock',
                obstacles: [
                    {
                        id: 1,
                        positionX: 200,
                        type: ObstacleTypes.spider,
                    },
                ],
                positionX: 200,
                rank: 0,
                characterNumber: 1,
                stunned: false,
            },
        ],
        roomId: 'CDES',
        trackLength: 500,
        chasersPositionX: 100,
        cameraPositionX: 100,
    };

    const coordinates = { x: gameStateData.playersState[index].positionX, y: posY };

    const mockRenderBackground = jest.fn();
    const mockRenderPlayer = jest.fn();
    const mockRenderObstacles = jest.fn();
    const mockRenderCave = jest.fn();
    const mockRenderChasers = jest.fn();

    const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
        mockRenderBackground,
        mockRenderPlayer,
        mockRenderObstacles,
        mockRenderCave,
        mockRenderChasers,
    });

    new Player(
        scene,
        laneHeight,
        index,
        coordinates,
        gameStateData,
        character,
        numberPlayers,
        gameToScreenMapper,
        renderer
    );

    it('should render background at initial initialization', () => {
        expect(mockRenderBackground).toHaveBeenCalledTimes(1);
    });

    it('should render player at initial initialization ', () => {
        expect(mockRenderPlayer).toHaveBeenCalledTimes(1);
    });

    it('should render obstacles at initial initialization ', () => {
        expect(mockRenderObstacles).toHaveBeenCalledTimes(1);
    });

    it('should render cave at initial initialization ', () => {
        expect(mockRenderCave).toHaveBeenCalledTimes(1);
    });

    it('should render chasers at initial initialization ', () => {
        expect(mockRenderChasers).toHaveBeenCalledTimes(1);
    });
});

describe('Player Renderer', () => {
    const numberPlayers = 2;
    const laneHeight = 100;
    const index = 0;
    const character = {
        name: 'mock',
        file: 'test',
        animations: new Map<AnimationName, CharacterAnimation>([]),
        properties: {
            frameWidth: 10,
            frameHeight: 10,
        },
    };
    const laneHeightsPerNumberPlayers = [10];
    const posY = 200;
    const scene = new MainScene();
    const gameToScreenMapper = new GameToScreenMapper(200, 500);

    const gameStateData = {
        gameState: GameState.started,
        numberOfObstacles: 4,
        playersState: [
            {
                dead: false,
                atObstacle: false,
                finished: false,
                finishedTimeMs: 0,
                id: '1',
                isActive: true,
                name: 'Mock',
                obstacles: [],
                positionX: 200,
                rank: 0,
                characterNumber: 1,
                stunned: false,
            },
        ],
        roomId: 'CDES',
        trackLength: 500,
        chasersPositionX: 100,
        cameraPositionX: 100,
    };

    const coordinates = { x: gameStateData.playersState[index].positionX, y: posY };

    it('should call destroyCave when player is dead', () => {
        const mockDestroyCave = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockDestroyCave,
        });

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.handlePlayerDead();

        expect(mockDestroyCave).toHaveBeenCalledTimes(1);
    });

    it('should call movePlayerForward with mapped xPosition when moveForward is called', () => {
        const mockMovePlayerForward = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockMovePlayerForward,
        });
        const newXPosition = 300;

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.moveForward(newXPosition);

        expect(mockMovePlayerForward).toHaveBeenCalledWith(gameToScreenMapper.mapGameMeasurementToScreen(newXPosition));
    });

    it('should call renderWarningIcon when player is approachingObstacle', () => {
        const mockRenderWarningIcon = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockRenderWarningIcon,
        });

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.handleApproachingObstacle();

        expect(mockRenderWarningIcon).toHaveBeenCalledTimes(1);
    });

    it('should call handleSkippedObstacle when player skipps obstacle', () => {
        const mockHandleSkippedObstacle = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockHandleSkippedObstacle,
        });

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.handleObstacleSkipped();

        expect(mockHandleSkippedObstacle).toHaveBeenCalledTimes(1);
    });

    it('should call destroyWarningIcon when player skipped or solved obstacle', () => {
        const mockDestroyWarningIcon = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockDestroyWarningIcon,
        });

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.destroyWarningIcon();

        expect(mockDestroyWarningIcon).toHaveBeenCalledTimes(1);
    });

    it('should call renderCave when setCave is called', () => {
        const mockRenderCave = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockRenderCave,
        });
        const newXPosition = 300;

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.setCave(newXPosition);

        expect(mockRenderCave).toHaveBeenCalledWith(gameToScreenMapper.mapGameMeasurementToScreen(newXPosition), posY);
    });

    it('should call stopAnimation when player stops running', () => {
        const mockStopAnimation = jest.fn();
        const renderer = new InMemoryPlayerRenderer(scene, numberPlayers, laneHeightsPerNumberPlayers, {
            mockStopAnimation,
        });

        const player = new Player(
            scene,
            laneHeight,
            index,
            coordinates,
            gameStateData,
            character,
            numberPlayers,
            gameToScreenMapper,
            renderer
        );

        player.stopRunning();

        expect(mockStopAnimation).toHaveBeenCalledTimes(1);
    });
});
