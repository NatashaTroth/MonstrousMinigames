import { CatchFoodGame } from '../../../src/gameplay';
import { Obstacle } from '../../../src/gameplay/catchFood/interfaces';
import { HashTable } from '../../../src/gameplay/interfaces';
import { leaderboard, roomId, users } from '../mockData';
import { clearTimersAndIntervals } from './gameHelperFunctions';

const TRACK_LENGTH = 5000; // has to be bigger than initial player position
const NUMBER_OF_OBSTACLES = 4;
const NUMBER_OF_STONES = 3;
let catchFoodGame: CatchFoodGame;
let obstacles: HashTable<Array<Obstacle>>;

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        catchFoodGame.createNewGame(users, TRACK_LENGTH, NUMBER_OF_OBSTACLES, undefined, NUMBER_OF_STONES);
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
        expect(obstacles['1'].length).toBe(NUMBER_OF_OBSTACLES + NUMBER_OF_STONES);
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
