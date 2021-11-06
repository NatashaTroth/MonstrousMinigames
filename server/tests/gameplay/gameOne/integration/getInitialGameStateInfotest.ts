import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
// import { GameState } from '../../../../src/gameplay/enums';
import * as InitialGameParameters from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
// import { GameStateInfo } from '../../../../src/gameplay/gameOne/interfaces';
import { leaderboard, roomId, users } from '../../mockData';
import { clearTimersAndIntervals } from '../gameOneHelperFunctions';

let gameOne: GameOne;
// let gameStateInfo: GameStateInfo;

describe('Get Obstacle Positions test', () => {
    beforeEach(async () => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(
            users,
            InitialGameParameters.TRACK_LENGTH,
            InitialGameParameters.NUMBER_OBSTACLES,
            InitialGameParameters.NUMBER_STONES
        );
        // gameStateInfo = gameOne.getGameStateInfo();
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    //TODO test initial game state info
    // it('should return the track length', async () => {
    //     expect(gameStateInfo.trackLength).toBe(TRACKLENGTH);
    // });

    // it('should return the number of obstacles', async () => {
    //     expect(gameStateInfo.numberOfObstacles).toBe(NUMBER_OF_OBSTACLES);
    // });

    it.todo('these tests');
});
