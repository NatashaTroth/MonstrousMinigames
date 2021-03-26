import { CatchFoodGame } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/interfaces/GameState';
import { startGameAndAdvanceCountdown } from './startGame';

let catchFoodGame: CatchFoodGame;

describe('Game logic tests', () => {
    beforeEach(() => {
        // global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    //-----Pause-----
    it('Can pause game when game has started', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(catchFoodGame.gameState).toBe(GameState.Paused);
    });

    it('Cannot pause game when game has not started', async () => {
        catchFoodGame.pauseGame();
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    it('sets pause time to now', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(trimMsTime(catchFoodGame.gamePausedTime)).toBe(trimMsTime(Date.now()));
    });

    it('Cannot pause game when game has not started', async () => {
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

    //TODO test that time is calculated correctly

    function trimMsTime(time: number) {
        const timeStr = time.toString();
        const trimmedTime = timeStr.substr(0, timeStr.length - 2);
        return parseInt(trimmedTime);
    }

    //-----Resume-----
    it('Can resume game when game has been paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.resumeGame();
        expect(catchFoodGame.gameState).toBe(GameState.Started);
    });

    it('Cannot resume game when game has not started', async () => {
        catchFoodGame.resumeGame();
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    it('Cannot resume game when game has not been paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.resumeGame();
        expect(catchFoodGame.gameState).toBe(GameState.Started);
    });
});
