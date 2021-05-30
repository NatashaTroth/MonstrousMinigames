import { CatchFoodGame } from '../../../src/gameplay';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, getToCreatedGameState, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
// const dateNow = 1618665766156;

describe('Chasers', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });
    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('starts chasers at positionX 0', async () => {
        getToCreatedGameState(catchFoodGame);
        expect(catchFoodGame.chasersPositionX).toBe(0);
    });

    //TODO (?)
    // it('chasers at positionX 0 until timeWhenChasersAppear', async () => {
    //     startGameAndAdvanceCountdown(catchFoodGame);
    //     jest.advanceTimersByTime(catchFoodGame.timeWhenChasersAppear);
    //     expect(catchFoodGame.chasersPositionX).toBe(0);
    // });

    it('chasers at positionX 0 until timeWhenChasersAppear', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        jest.advanceTimersByTime(500);
        expect(catchFoodGame.chasersPositionX).toBeGreaterThan(0);
    });

    //TODO more tests
});
