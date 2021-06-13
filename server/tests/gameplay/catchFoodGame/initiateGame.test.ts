import { CatchFoodGame } from '../../../src/gameplay';
import { ObstacleType } from '../../../src/gameplay/catchFood/enums';
import { Obstacle } from '../../../src/gameplay/catchFood/interfaces';
import { GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import { clearTimersAndIntervals } from './gameHelperFunctions';

const TRACKLENGTH = 5000;
const NUMBER_OF_OBSTACLES = 4;
let catchFoodGame: CatchFoodGame;
// const OBSTACLE_RANGE = 70;
const OBSTACLE_TYPE_KEYS = Object.keys(ObstacleType);

describe('Initiate CatchFoodGame correctly', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.createNewGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('initiates players state with correct number of players', async () => {
        expect(Object.keys(catchFoodGame.playersState).length).toBe(users.length);
    });

    it('initiates trackLength with correct length', async () => {
        expect(catchFoodGame.trackLength).toBe(TRACKLENGTH);
    });

    it('initiates roomId with correct room', async () => {
        expect(catchFoodGame.roomId).toBe(users[0].roomId);
    });

    it('initiates gameStartedTime with 0', async () => {
        const catchFoodGameInit = new CatchFoodGame(roomId, leaderboard);
        expect(catchFoodGameInit.gameStartedTime).toBe(0);
    });

    it('initiates correct number of obstacles', async () => {
        expect(catchFoodGame.numberOfObstacles).toBe(NUMBER_OF_OBSTACLES);
    });

    it('initiates current rank as 1', async () => {
        expect(catchFoodGame.currentRank).toBe(1);
    });

    it('initiates current rank as 1', async () => {
        expect(catchFoodGame.currentRank).toBe(1);
    });

    it('initiates first player with the correct name', async () => {
        expect(catchFoodGame.playersState['1'].name).toBe(users[0].name);
    });

    it('initiates player positionX with initial position', async () => {
        expect(catchFoodGame.playersState['1'].positionX).toBe(catchFoodGame.initialPlayerPositionX);
    });

    it('initiates player not at an obstacle', async () => {
        expect(catchFoodGame.playersState['1'].atObstacle).toBeFalsy();
    });

    it('initiates player as not finished', async () => {
        expect(catchFoodGame.playersState['1'].finished).toBeFalsy();
    });

    it('initiates player as not dead', async () => {
        expect(catchFoodGame.playersState['1'].dead).toBeFalsy();
    });

    it('initiates player as not stunned', async () => {
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    it('initiates player time when stunned as 0', async () => {
        expect(catchFoodGame.playersState['1'].timeWhenStunned).toBe(0);
    });

    it('initiates character number', async () => {
        expect(catchFoodGame.playersState['1'].characterNumber).toBe(users[0].characterNumber);
    });

    it('initiates player with correct number of obstacles (all)', async () => {
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(NUMBER_OF_OBSTACLES);
    });

    function getObstacleRange(catchFoodGame: CatchFoodGame): number {
        return (
            Math.floor(
                (catchFoodGame.trackLength - catchFoodGame.initialPlayerPositionX) /
                    (catchFoodGame.numberOfObstacles + 1)
            ) - 30
        );
    }

    it('initiates the first obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);
        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(obstacles[0].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange);
        expect(obstacles[0].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 2);
    });

    it('initiates the second obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);
        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(obstacles[1].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 2);
        expect(obstacles[1].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 3);
    });

    it('initiates the third obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);

        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(obstacles[2].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 3);
        expect(obstacles[2].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 4);
    });

    it('initiates the fourth obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);

        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(obstacles[3].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 4);
        expect(obstacles[3].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 5);
    });

    it('initiates the first obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(OBSTACLE_TYPE_KEYS).toContain(obstacles[0].type);
    });

    it('initiates the second obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(OBSTACLE_TYPE_KEYS).toContain(obstacles[1].type);
    });

    it('initiates the third obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(OBSTACLE_TYPE_KEYS).toContain(obstacles[2].type);
    });

    it('initiates the fourth obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.playersState['1'].obstacles;
        expect(OBSTACLE_TYPE_KEYS).toContain(obstacles[3].type);
    });

    it('initiates gameState as Created', async () => {
        expect(catchFoodGame.gameState).toBe(GameState.Created);
    });
});
