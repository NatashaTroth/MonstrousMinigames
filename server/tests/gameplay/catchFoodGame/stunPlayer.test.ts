import { CatchFoodGame } from '../../../src/gameplay';
// import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
// import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
// import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
// let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
        startGameAndAdvanceCountdown(catchFoodGame);
    });

    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    // const dateNow = 1618665766156;
    // Date.now = jest.fn(() => dateNow);
    // startGameAndAdvanceCountdown(catchFoodGame);

    //TODO stun wevent!!!!!!
    it('stunPlayer should set a player as stunned', async () => {
        catchFoodGame.stunPlayer('1');
        expect(catchFoodGame.playersState['1'].stunned).toBeTruthy();
    });

    // it('stunPlayer should be over after stun time', async () => {
    //     catchFoodGame.stunPlayer('1');
    //     jest.advanceTimersByTime(catchFoodGame.stunnedTime);
    //     expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    // });
});
