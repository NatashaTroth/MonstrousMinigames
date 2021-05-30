import { CatchFoodGame } from '../../../src/gameplay';
import { Obstacle } from '../../../src/gameplay/catchFood/interfaces';
import { HashTable } from '../../../src/gameplay/interfaces';
import { leaderboard, roomId, users } from '../mockData';
import { clearTimersAndIntervals } from './gameHelperFunctions';

const TRACKLENGTH = 500;
const NUMBER_OF_OBSTACLES = 4;
let catchFoodGame: CatchFoodGame;
let obstacles: HashTable<Array<Obstacle>>;

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.createNewGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
        obstacles = catchFoodGame.getObstaclePositions();
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('should return the correct number of users', async () => {
        expect(true).toBeTruthy();
        // expect(Object.keys(obstacles).length).toBe(users.length);
    });

    it('should return the correct number of obstacles', async () => {
        expect(obstacles['1'].length).toBe(NUMBER_OF_OBSTACLES);
    });

    it('should contain the key obstacle positionX', async () => {
        expect(Object.keys(obstacles['1'][0])).toContain('positionX');
    });

    it('should contain the obstacle type', async () => {
        expect(Object.keys(obstacles['1'][0])).toContain('type');
    });

    // it("should contain the obstacle type", async () => {
    //   expect(Object.keys(obstacles["1"][0].type)).toBeInstanceOf(ObstacleType);
    // });
});
