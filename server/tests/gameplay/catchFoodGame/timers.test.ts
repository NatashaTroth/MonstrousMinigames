import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import { finishPlayer, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Timer tests', () => {
    beforeEach(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
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
        const stopGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'stopGame');
        jest.runAllTimers();
        expect(stopGameSpy).toHaveBeenCalledTimes(1);
        expect(stopGameSpy).toHaveBeenCalledWith(true);
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

        const eventData = getGameFinishedDataAfterTimeOut(catchFoodGame, dateNow);
        expect(eventData.playerRanks[0].finished).toBeTruthy();
        expect(eventData.playerRanks[1].finished).toBeFalsy();
        expect(eventData.playerRanks[2].finished).toBeFalsy();
        expect(eventData.playerRanks[3].finished).toBeFalsy();
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

    // Time out game
    jest.runAllTimers();
    return eventData;
}
