import { CatchFoodGame } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/interfaces/GameState';
import { startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
const dateNow = 1618665766156;

describe('Game logic tests', () => {
    beforeEach(() => {
        // global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())
        Date.now = jest.fn(() => dateNow);
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    //-----Pause-----
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
        expect(catchFoodGame.gamePausedTime).toBe(dateNow + 5000);
    });

    it('calculates timeOutRemainingTime correctly', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        Date.now = jest.fn(() => dateNow + 5000);
        catchFoodGame.pauseGame();
        expect(catchFoodGame.timeOutRemainingTime).toBe(catchFoodGame.timeOutLimit - 5000);
    });

    it('calls getGameTimePassedBeforePause when paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const getGameTimePassedBeforePauseSpy = jest.spyOn(
            CatchFoodGame.prototype as any,
            'getGameTimePassedBeforePause'
        );
        catchFoodGame.gameStartedTime = 10000;
        catchFoodGame.pauseGame();
        expect(getGameTimePassedBeforePauseSpy).toHaveBeenCalledTimes(1);
        expect(getGameTimePassedBeforePauseSpy).toReturn();
    });

    // function trimMsTime(time: number) {
    //     const timeStr = time.toString();
    //     const trimmedTime = timeStr.substr(0, timeStr.length - 2);
    //     return parseInt(trimmedTime);
    // }

    //-----Resume-----
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
        const gameStartTime = dateNow;
        const gamePauseTime = dateNow + 5000;
        Date.now = jest.fn(() => gamePauseTime);
        catchFoodGame.pauseGame();
        const gameResumeTime = dateNow + 15000;
        Date.now = jest.fn(() => gameResumeTime);
        catchFoodGame.resumeGame();
        const gameTimePassed = gamePauseTime - gameStartTime;
        const newGameStartedTime = gameResumeTime - gameTimePassed;
        expect(catchFoodGame.gameStartedTime).toBe(newGameStartedTime);
    });

    it('updates time correctly after pause, so that timeout happens after the defined time out time', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const gamePauseTime = dateNow + 5000;
        Date.now = jest.fn(() => gamePauseTime);
        catchFoodGame.pauseGame();
        const gameResumeTime = dateNow + 15000;
        Date.now = jest.fn(() => gameResumeTime);
        catchFoodGame.resumeGame();
        jest.advanceTimersByTime(catchFoodGame.timeOutLimit - 5000 - 1);
        expect(catchFoodGame.gameState).toBe(GameState.Started);
        jest.advanceTimersByTime(1);
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });
});
