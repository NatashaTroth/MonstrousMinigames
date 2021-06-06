import { CatchFoodGame } from '../../../src/gameplay';
// import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
// import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
// import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, finishPlayer, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

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

    it('stunPlayer should set a player as stunned', async () => {
        catchFoodGame.stunPlayer('1');
        expect(catchFoodGame.playersState['1'].stunned).toBeTruthy();
    });

    it('stunPlayer should stay stunned until stun time', async () => {
        catchFoodGame.stunPlayer('1');
        jest.advanceTimersByTime(catchFoodGame.stunnedTime - 1);
        expect(catchFoodGame.playersState['1'].stunned).toBeTruthy();
    });

    it('stunPlayer should be over after stun time', async () => {
        catchFoodGame.stunPlayer('1');
        jest.advanceTimersByTime(catchFoodGame.stunnedTime);
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    it('stun time should be paused during pause', async () => {
        catchFoodGame.stunPlayer('1');
        catchFoodGame.pauseGame();
        jest.advanceTimersByTime(catchFoodGame.stunnedTime * 2);
        expect(catchFoodGame.playersState['1'].stunned).toBeTruthy();
    });

    it('stun time should resume after pause and not finish early', async () => {
        catchFoodGame.stunPlayer('1');
        catchFoodGame.pauseGame();
        jest.advanceTimersByTime(catchFoodGame.stunnedTime * 2);
        catchFoodGame.resumeGame();
        jest.advanceTimersByTime(catchFoodGame.stunnedTime - 1);
        expect(catchFoodGame.playersState['1'].stunned).toBeTruthy();
    });

    it('stun time should resume after pause and finish on time', async () => {
        catchFoodGame.stunPlayer('1');
        catchFoodGame.pauseGame();
        jest.advanceTimersByTime(catchFoodGame.stunnedTime * 2);
        catchFoodGame.resumeGame();
        jest.advanceTimersByTime(catchFoodGame.stunnedTime);
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame.stunPlayer('1');
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame.stunPlayer('1');
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    it('should not stun a player who is already stunned', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame.stunPlayer('1');
        jest.advanceTimersByTime(2000);
        catchFoodGame.stunPlayer('1');
        jest.advanceTimersByTime(1000);
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    it('should not stun a player who is at an obstacle', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame.runForward('1', catchFoodGame.trackLength);
        catchFoodGame.stunPlayer('1');
        expect(catchFoodGame.playersState['1'].stunned).toBeFalsy();
    });

    //TODO how to handle stun when at obstacle?
});
