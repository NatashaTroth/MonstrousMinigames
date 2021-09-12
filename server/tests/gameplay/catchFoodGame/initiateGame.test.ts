import { CatchFoodGame } from '../../../src/gameplay';
import { ObstacleType, regularObstactTypes } from '../../../src/gameplay/catchFood/enums/ObstacleType';
import { Obstacle } from '../../../src/gameplay/catchFood/interfaces';
import { GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import { clearTimersAndIntervals } from './gameHelperFunctions';

const TRACK_LENGTH = 5000;
const NUMBER_OF_OBSTACLES = 4;
const NUMBER_OF_STONES = 2;
let catchFoodGame: CatchFoodGame;
// const OBSTACLE_RANGE = 70;
const REGULAR_OBSTACLE_TYPE_KEYS = regularObstactTypes;

describe('Initiate CatchFoodGame correctly', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.createNewGame(users, TRACK_LENGTH, NUMBER_OF_OBSTACLES, NUMBER_OF_STONES);
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('initiates players state with correct number of players', async () => {
        expect(catchFoodGame.players.size).toBe(users.length);
    });

    it('initiates trackLength with correct length', async () => {
        expect(catchFoodGame.trackLength).toBe(TRACK_LENGTH);
    });

    it('initiates roomId with correct room', async () => {
        expect(catchFoodGame.roomId).toBe(users[0].roomId);
    });

    it('initiates gameStartedTime with 0', async () => {
        const catchFoodGameInit = new CatchFoodGame(roomId, leaderboard);
        expect(catchFoodGameInit['_gameStartedAt']).toBe(0);
    });

    it('initiates correct number of obstacles', async () => {
        expect(catchFoodGame.numberOfObstacles).toBe(NUMBER_OF_OBSTACLES);
    });

    it('initiates current rank as 1', async () => {
        expect(catchFoodGame['currentRank']).toBe(1);
    });

    it('initiates current rank as 1', async () => {
        expect(catchFoodGame['currentRank']).toBe(1);
    });

    it('initiates first player with the correct name', async () => {
        expect(catchFoodGame.players.get('1')!.name).toBe(users[0].name);
    });

    it('initiates player positionX with initial position', async () => {
        expect(catchFoodGame.players.get('1')!.positionX).toBe(catchFoodGame.initialPlayerPositionX);
    });

    it('initiates player not at an obstacle', async () => {
        expect(catchFoodGame.players.get('1')!.atObstacle).toBeFalsy();
    });

    it('initiates player as not finished', async () => {
        expect(catchFoodGame.players.get('1')!.finished).toBeFalsy();
    });

    it('initiates player as not dead', async () => {
        expect(catchFoodGame.players.get('1')!.dead).toBeFalsy();
    });

    it('initiates player as not stunned', async () => {
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });

    it('initiates character number', async () => {
        expect(catchFoodGame.players.get('1')!.characterNumber).toBe(users[0].characterNumber);
    });

    it('initiates player with correct number of obstacles', () => {
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles.length).toBe(NUMBER_OF_OBSTACLES);
    });

    it('initiates player with correct number of stones', () => {
        const stones: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
        expect(stones.length).toBe(NUMBER_OF_STONES);
    });

    it('initiates player with stones not overlapping with other obstacles', () => {
        const obstacles = catchFoodGame.players.get('1')!.obstacles;

        for (let i = 0; i < obstacles.length; i++) {
            if (obstacles[i].type !== ObstacleType.Stone) {
                continue;
            }
            if (i > 0) {
                expect(obstacles[i].positionX).toBeGreaterThan(obstacles[i - 1].positionX);
            }
            if (i < obstacles.length - 1) {
                expect(obstacles[i].positionX).toBeLessThan(obstacles[i + 1].positionX);
            }
        }
    });

    it('initiates player with correct number of obstacles (all)', async () => {
        expect(catchFoodGame.players.get('1')!.obstacles.length).toBe(NUMBER_OF_OBSTACLES + NUMBER_OF_STONES);
    });

    function getObstacleRange(catchFoodGame: CatchFoodGame): number {
        return (
            Math.floor(
                (catchFoodGame.trackLength - catchFoodGame.initialPlayerPositionX) /
                    (catchFoodGame.numberOfObstacles + 1)
            ) - 100
        );
    }

    it('initiates the first obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[0].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange);
        expect(obstacles[0].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 2);
    });

    it('initiates the second obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[1].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 2);
        expect(obstacles[1].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 3);
    });

    it('initiates the third obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);

        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[2].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 3);
        expect(obstacles[2].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 4);
    });

    it('initiates the fourth obstacle in the correct range', async () => {
        const obstacleRange = getObstacleRange(catchFoodGame);

        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(obstacles[3].positionX).toBeGreaterThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 4);
        expect(obstacles[3].positionX).toBeLessThanOrEqual(catchFoodGame.initialPlayerPositionX + obstacleRange * 5);
    });

    it('initiates the first obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[0].type);
    });

    it('initiates the second obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[1].type);
    });

    it('initiates the third obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[2].type);
    });

    it('initiates the fourth obstacle with the correct obstacle type', async () => {
        const obstacles: Array<Obstacle> = catchFoodGame.players
            .get('1')!
            .obstacles.filter(obstacle => obstacle.type !== ObstacleType.Stone);
        expect(REGULAR_OBSTACLE_TYPE_KEYS).toContain(obstacles[3].type);
    });

    it('initiates gameState as Created', async () => {
        expect(catchFoodGame.gameState).toBe(GameState.Created);
    });
});
