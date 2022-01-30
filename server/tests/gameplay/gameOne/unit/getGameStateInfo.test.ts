import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { GameStateInfo } from '../../../../src/gameplay/gameOne/interfaces';
import { leaderboard, roomId, users } from '../../mockData';
import { clearTimersAndIntervals } from '../gameOneHelperFunctions';

let gameOne: GameOne;
let gameStateInfo: GameStateInfo;
const InitialGameParameters = getInitialParams();

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
        gameStateInfo = gameOne.getGameStateInfo();
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('should return the game state', async () => {
        expect(gameStateInfo.gameState).toBe(GameState.Created);
    });

    it('should return the roomId', async () => {
        expect(gameStateInfo.roomId).toBe(users[0].roomId);
    });

    // it('should return the track length', async () => {
    //     expect(initialGameStateInfo.trackLength).toBe(InitialParameters.TRACK_LENGTH);
    // });

    // it('should return the number of obstacles', async () => {
    //     expect(initialGameStateInfo.numberOfObstacles).toBe(InitialParameters.NUMBER_OBSTACLES);
    // });

    it('should return the playersState as an Array', async () => {
        expect(Array.isArray(gameStateInfo.playersState)).toBe(true);
    });

    it('returns first player with the correct name', async () => {
        expect(gameStateInfo.playersState[0].name).toBe(users[0].name);
    });

    it('returns player positionX with initial position', async () => {
        expect(gameStateInfo.playersState[0].positionX).toBe(gameOne.initialPlayerPositionX);
    });

    it('returns player not at an obstacle', async () => {
        expect(gameStateInfo.playersState[0].atObstacle).toBeFalsy();
    });

    it('returns player as not finished', async () => {
        expect(gameStateInfo.playersState[0].finished).toBeFalsy();
    });

    it('returns player as not finished', async () => {
        expect(gameStateInfo.playersState[0].dead).toBeFalsy();
    });

    it('returns player is active', async () => {
        expect(gameStateInfo.playersState[0].isActive).toBeTruthy();
    });

    it('returns chaser position', async () => {
        expect(gameStateInfo.chasersPositionX).toBe(InitialGameParameters.CHASERS_POSITION_X);
    });
});
