import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import InitialParameters from '../../../../src/gameplay/gameOne/constants/InitialParameters';
import { GameStateInfo, InitialGameStateInfo } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, trackLength, users } from '../../mockData';
import { clearTimersAndIntervals } from '../gameOneHelperFunctions';

let gameOne: GameOne;
let gameStateInfo: GameStateInfo;

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

    it('returns player with correct number of obstacles (all)', async () => {
        expect(gameStateInfo.playersState[0].obstacles.length).toBe(
            InitialParameters.NUMBER_OBSTACLES + InitialParameters.NUMBER_STONES
        );
    });

    it('returns chaser position', async () => {
        expect(gameStateInfo.chasersPositionX).toBe(InitialParameters.CHASERS_POSITION_X);
    });
});
