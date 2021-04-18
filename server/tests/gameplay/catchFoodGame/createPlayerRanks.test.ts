import { CatchFoodGame } from '../../../src/gameplay';
import { finishGame, startGameAndAdvanceCountdown } from './gameHelperFunctions';

// const TRACKLENGTH = 500;

let catchFoodGame: CatchFoodGame;

describe('Game logic tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    it('playerHasReachedObstacle is called and returns false', async () => {
        //TODO
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.gameStartedTime = 1000;
        const createPlayerRanksSpy = jest.spyOn(CatchFoodGame.prototype as any, 'createPlayerRanks');
        finishGame(catchFoodGame);
        expect(createPlayerRanksSpy).toHaveBeenCalled();
    });

    //TODO finish
});
