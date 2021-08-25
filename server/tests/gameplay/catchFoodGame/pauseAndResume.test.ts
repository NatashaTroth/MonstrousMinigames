import { CatchFoodGame } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums/GameState';
import { leaderboard, roomId } from '../mockData';
import { advanceCountdown, clearTimersAndIntervals, releaseThreadN, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
const dateNow = 1618665766156;

describe('Pause tests', () => {
    beforeEach(() => {
        // global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())
        jest.useFakeTimers();
        Date.now = jest.fn(() => dateNow);
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('Can pause game when game has started', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(catchFoodGame.gameState).toBe(GameState.Paused);
    });

    it('Cannot pause game when game has not started', async () => {
        try {
            catchFoodGame.pauseGame();
        } catch (e) {
            // ignore in this test
        }
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    it('sets pause time to now', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        Date.now = jest.fn(() => dateNow + 5000);
        catchFoodGame.pauseGame();
        expect(catchFoodGame['_gamePausedAt']).toBe(dateNow + 5000);
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
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Can resume game when game has been paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.resumeGame();
        expect(catchFoodGame.gameState).toBe(GameState.Started);
    });

    it('Cannot resume game when game has not started', async () => {
        try {
            catchFoodGame.resumeGame();
        } catch (e) {
            //ignore in this test
        }
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    it('Cannot resume game when game has not been paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        try {
            catchFoodGame.resumeGame();
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.gameState).toBe(GameState.Started);
    });

    it('updates gameStartedTime correctly to accommodate pause', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);

        const gameStartTime = Date.now();
        const gamePauseTime = dateNow + 5000;
        const gameResumeTime = dateNow + 15000;
        const gameTimePassed = gamePauseTime - gameStartTime;
        const newGameStartedTime = gameResumeTime - gameTimePassed;

        Date.now = jest.fn(() => gamePauseTime);
        catchFoodGame.pauseGame();
        Date.now = jest.fn(() => gameResumeTime);
        catchFoodGame.resumeGame();

        expect(catchFoodGame['gameTime']).toBe(gameTimePassed);
        expect(catchFoodGame['gameStartedAt']).toBe(newGameStartedTime);
    });

    it('updates time correctly after pause, so that timeout happens after the defined time out time', async () => {
        // disable chasers
        jest.spyOn(catchFoodGame as any, 'updateChasersPosition').mockImplementation(() => 0);

        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);

        const gameStartTime = Date.now();
        const gamePauseTime = gameStartTime + 5000;
        const gameResumeTime = gamePauseTime + 10000;

        Date.now = jest.fn(() => gamePauseTime);
        catchFoodGame.pauseGame();
        Date.now = jest.fn(() => gameResumeTime);
        catchFoodGame.resumeGame();
        advanceCountdown(catchFoodGame.timeOutLimit - 5000 - 1);
        await releaseThreadN(3);
        expect(catchFoodGame.gameState).toBe(GameState.Started);
        advanceCountdown(50);
        await releaseThreadN(3);
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });
});
