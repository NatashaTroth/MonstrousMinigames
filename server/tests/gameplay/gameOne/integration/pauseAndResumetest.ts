import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums/GameState';
import { leaderboard, roomId } from '../../mockData';
import {
    clearTimersAndIntervals, releaseThreadN, startGameAndAdvanceCountdown
} from './gameOneHelperFunctions';

let gameOne: GameOne;
const dateNow = 1618665766156;

describe('Pause tests', () => {
    beforeEach(() => {
        // global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())
        jest.useFakeTimers();
        Date.now = jest.fn(() => dateNow);
        gameOne = new GameOne(roomId, leaderboard);
    });
    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('Can pause game when game has started', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.pauseGame();
        expect(gameOne.gameState).toBe(GameState.Paused);
    });

    it('Cannot pause game when game has not started', async () => {
        try {
            gameOne.pauseGame();
        } catch (e) {
            // ignore in this test
        }
        expect(gameOne.gameState).toBe(GameState.Initialised);
    });

    it('sets pause time to now', async () => {
        startGameAndAdvanceCountdown(gameOne);
        Date.now = jest.fn(() => dateNow + 5000);
        gameOne.pauseGame();
        expect(gameOne['_gamePausedAt']).toBe(dateNow + 5000);
    });

    // function trimMsTime(time: number) {
    //     const timeStr = time.toString();
    //     const trimmedTime = timeStr.substr(0, timeStr.length - 2);
    //     return parseInt(trimmedTime);
    // }
});

describe('Resume tests', () => {
    beforeEach(() => {
        // global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())
        jest.useFakeTimers();
        Date.now = jest.fn(() => dateNow);
        gameOne = new GameOne(roomId, leaderboard);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can resume game when game has been paused', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.pauseGame();
        gameOne.resumeGame();
        expect(gameOne.gameState).toBe(GameState.Started);
    });

    it('Cannot resume game when game has not started', async () => {
        try {
            gameOne.resumeGame();
        } catch (e) {
            //ignore in this test
        }
        expect(gameOne.gameState).toBe(GameState.Initialised);
    });

    it('Cannot resume game when game has not been paused', async () => {
        startGameAndAdvanceCountdown(gameOne);
        try {
            gameOne.resumeGame();
        } catch (e) {
            //ignore for this test
        }
        expect(gameOne.gameState).toBe(GameState.Started);
    });

    it('updates gameStartedTime correctly to accommodate pause', async () => {
        startGameAndAdvanceCountdown(gameOne);
        await releaseThreadN(3);

        const gameStartTime = Date.now();
        const gamePauseTime = dateNow + 5000;
        const gameResumeTime = dateNow + 15000;
        const gameTimePassed = gamePauseTime - gameStartTime;
        const newGameStartedTime = gameResumeTime - gameTimePassed;

        Date.now = jest.fn(() => gamePauseTime);
        gameOne.pauseGame();
        Date.now = jest.fn(() => gameResumeTime);
        gameOne.resumeGame();

        expect(gameOne['gameTime']).toBe(gameTimePassed);
        expect(gameOne['gameStartedAt']).toBe(newGameStartedTime);
    });
});
