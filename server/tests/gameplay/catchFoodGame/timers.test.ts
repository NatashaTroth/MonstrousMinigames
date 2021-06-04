import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, finishPlayer, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Timer tests', () => {
    beforeEach(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(() => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('sets the timeOutLimit to 5 minutes', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(catchFoodGame.timeOutLimit).toBe(5 * 60 * 1000);
    });

    it('sets the timeOutLimit to 5 minutes', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000);
    });

    it('stops game when time out', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const stopGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'stopGameTimeout');
        jest.advanceTimersByTime(catchFoodGame.timeOutLimit);
        expect(stopGameSpy).toHaveBeenCalledTimes(1);
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });

    it('should emit correct playerRanks when the game has timed out', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        const eventData = getGameFinishedDataAfterTimeOut(catchFoodGame, dateNow);
        expect(eventData.playerRanks[0].totalTimeInMs).toBe(catchFoodGame.timeOutLimit);
    });

    it('should emit correct ranks when the game has timed out and no players reached the goal', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        const eventData = getGameFinishedDataAfterTimeOut(catchFoodGame, dateNow);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(1);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(1);
    });

    it('should emit correct ranks when the game has timed out and one player reached the goal', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        Date.now = jest.fn(() => catchFoodGame.countdownTime);

        finishPlayer(catchFoodGame, '1');

        const eventData = getGameFinishedDataAfterTimeOut(catchFoodGame, dateNow);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(2);
        expect(eventData.playerRanks[2].rank).toBe(2);
        expect(eventData.playerRanks[3].rank).toBe(2);
    });

    it('should emit correct finished boolean on timed out players', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);

        finishPlayer(catchFoodGame, '1');

        //players 3 and 4 should not be caught
        catchFoodGame.playersState['3'].positionX = catchFoodGame.chasersPositionX + 1000;
        catchFoodGame.playersState['4'].positionX = catchFoodGame.chasersPositionX + 1000;

        //catch player 2
        catchFoodGame.playersState['2'].positionX = 0;
        Date.now = jest.fn(() => dateNow + catchFoodGame.timeWhenChasersAppear + 1000);
        jest.advanceTimersByTime(catchFoodGame.timeWhenChasersAppear + 1000);

        const eventData = getGameFinishedDataAfterTimeOut(catchFoodGame, dateNow);
        expect(eventData.playerRanks[0].finished).toBeTruthy();
        expect(eventData.playerRanks[0].dead).toBeFalsy();
        expect(eventData.playerRanks[1].dead).toBeTruthy(); //should be dead cause caught (cause didn't run)
        expect(eventData.playerRanks[2].dead).toBeFalsy();
        expect(eventData.playerRanks[3].dead).toBeFalsy();
    });
});

function getGameFinishedDataAfterTimeOut(catchFoodGame: CatchFoodGame, dateNow: number) {
    let eventData: GameEvents.GameHasFinished = {
        roomId: '',
        gameState: GameState.Started,
        trackLength: 0,
        numberOfObstacles: 0,
        playerRanks: [],
    };

    gameEventEmitter.on(GameEventTypes.GameHasTimedOut, (data: GameEvents.GameHasFinished) => {
        eventData = data;
    });
    // startGameAndAdvanceCountdown(catchFoodGame);

    Date.now = jest.fn(() => dateNow + catchFoodGame.timeOutLimit);

    //avoid being caught (for this test)
    catchFoodGame.chasersPositionX = catchFoodGame.trackLength * -100;
    // Time out game
    jest.advanceTimersByTime(catchFoodGame.timeOutLimit);
    jest.runAllTimers();
    return eventData;
}
