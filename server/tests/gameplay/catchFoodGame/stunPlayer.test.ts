import "reflect-metadata";

import { CatchFoodGame } from "../../../src/gameplay";
import { leaderboard, roomId } from "../mockData";
import {
    advanceCountdown, clearTimersAndIntervals, finishPlayer, releaseThread, releaseThreadN,
    startGameAndAdvanceCountdown
} from "./gameHelperFunctions";

let catchFoodGame: CatchFoodGame;
// let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);

        catchFoodGame.players.get('1')!.stonesCarrying = 1;
        catchFoodGame.players.get('2')!.stonesCarrying = 1;
        jest.useFakeTimers();
        startGameAndAdvanceCountdown(catchFoodGame);
    });

    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    // const dateNow = 1618665766156;
    // Date.now = jest.fn(() => dateNow);
    // startGameAndAdvanceCountdown(catchFoodGame);

    it('stunPlayer should be over after stun time', async () => {
        catchFoodGame['stunPlayer']('1', '2');
        advanceCountdown(catchFoodGame.stunnedTime);
        await releaseThread();
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });

    it('stun time should resume after pause and finish on time', async () => {
        catchFoodGame['stunPlayer']('1', '2');
        catchFoodGame.pauseGame();
        advanceCountdown(catchFoodGame.stunnedTime * 2);
        await releaseThread();
        catchFoodGame.resumeGame();
        await releaseThreadN(3);
        advanceCountdown(catchFoodGame.stunnedTime);
        await releaseThread();
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame['stunPlayer']('1', '2');
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame['stunPlayer']('1', '2');
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });

    it('should not stun a player who is already stunned', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame['stunPlayer']('1', '2');
        advanceCountdown(2000);
        await releaseThread();
        catchFoodGame['stunPlayer']('1', '2');
        advanceCountdown(1000);
        await releaseThread();
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });

    it('should not stun a player who is at an obstacle', async () => {
        finishPlayer(catchFoodGame, '1');
        catchFoodGame['runForward']('1', catchFoodGame.trackLength);
        catchFoodGame['stunPlayer']('1', '2');
        expect(catchFoodGame.players.get('1')!.stunned).toBeFalsy();
    });
});
