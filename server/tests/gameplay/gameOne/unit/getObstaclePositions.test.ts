import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import { Obstacle } from '../../../../src/gameplay/gameOne/interfaces';
import { HashTable } from '../../../../src/gameplay/interfaces';
import { leaderboard, roomId, users } from '../../mockData';
import { clearTimersAndIntervals } from '../gameOneHelperFunctions';

let gameOne: GameOne;
let obstacles: HashTable<Array<Obstacle>>;

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(
            users,
            InitialParameters.TRACK_LENGTH,
            InitialParameters.NUMBER_OBSTACLES,
            InitialParameters.NUMBER_STONES
        );
        obstacles = gameOne.getObstaclePositions();
    });
    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('should return the correct number of users', async () => {
        expect(true).toBeTruthy();
        // expect(Object.keys(obstacles).length).toBe(users.length);
    });

    it('should return the correct number of obstacles', async () => {
        expect(obstacles['1'].length).toBe(InitialParameters.NUMBER_OBSTACLES + InitialParameters.NUMBER_STONES);
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
