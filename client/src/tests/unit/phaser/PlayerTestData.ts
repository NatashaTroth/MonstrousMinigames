import MainScene from '../../../domain/game1/screen/components/MainScene';
import { AnimationNameGame1 } from '../../../domain/phaser/enums/AnimationName';
import { GameToScreenMapper } from '../../../domain/phaser/game1/GameToScreenMapper';
import { CharacterAnimation } from '../../../domain/phaser/gameInterfaces';
import { GameState, ObstacleTypes } from '../../../utils/constants';

export const numberPlayers = 1;
export const laneHeight = 100;
export const index = 0;
export const laneHeightsPerNumberPlayers = [10];
export const posY = 200;
export const scene = new MainScene();
export const gameToScreenMapper = new GameToScreenMapper(200, 500);

export const character = {
    name: 'mock',
    file: 'test',
    animations: new Map<AnimationNameGame1, CharacterAnimation>([]),
    properties: {
        frameWidth: 10,
        frameHeight: 10,
    },
};

export const spiderObstacle = {
    id: 1,
    positionX: 200,
    type: ObstacleTypes.spider,
};

export const treeObstacle = {
    id: 1,
    positionX: 200,
    type: ObstacleTypes.treeStump,
};

export const trashObstacle = {
    id: 1,
    positionX: 200,
    type: ObstacleTypes.trash,
};

export const stoneObstacle = {
    id: 1,
    positionX: 200,
    type: ObstacleTypes.stone,
};

export const gameStateData = {
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
            obstacles: [spiderObstacle, treeObstacle, trashObstacle, stoneObstacle],
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

export const coordinates = { x: gameStateData.playersState[index].positionX, y: posY };
