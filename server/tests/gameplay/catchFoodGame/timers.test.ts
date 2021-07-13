import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId } from '../mockData';
import {
    advanceCountdown,
    clearTimersAndIntervals, finishPlayer, releaseThreadN, startGameAndAdvanceCountdown
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

    it('stops game when time out', async () => {
        const stopGameSpy = jest.spyOn(catchFoodGame as any, 'stopGameTimeout');
        // disable chasers as they chase faster than the game times out
        jest.spyOn(catchFoodGame as any, 'updateChasersPosition').mockImplementation(() => 0);

        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);
        advanceCountdown(catchFoodGame.timeOutLimit);
        await releaseThreadN(3);
        expect(stopGameSpy).toHaveBeenCalledTimes(1);
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });

    it('should emit correct playerRanks when the game has timed out', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);
        const eventData = await getGameFinishedDataAfterTimeOut(catchFoodGame);
        expect(eventData.playerRanks[0].totalTimeInMs).toBe(catchFoodGame.timeOutLimit);
    });

    it('should emit correct ranks when the game has timed out and no players reached the goal', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);
        const eventData = await getGameFinishedDataAfterTimeOut(catchFoodGame);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(1);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(1);
    });

    it('should emit correct ranks when the game has timed out and one player reached the goal', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);

        finishPlayer(catchFoodGame, '1');

        const eventData = await getGameFinishedDataAfterTimeOut(catchFoodGame);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(2);
        expect(eventData.playerRanks[2].rank).toBe(2);
        expect(eventData.playerRanks[3].rank).toBe(2);
    });

    it('should emit correct finished boolean on timed out players', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        await releaseThreadN(3);

        finishPlayer(catchFoodGame, '1');

        //players 3 and 4 should not be caught
        catchFoodGame.players.get('3')!.positionX = catchFoodGame.chasersPositionX + 1330;
        catchFoodGame.players.get('4')!.positionX = catchFoodGame.chasersPositionX + 1330;

        //catch player 2
        catchFoodGame.players.get('2')!.positionX = 0;
        advanceCountdown(catchFoodGame.timeWhenChasersAppear + 1000);
        await releaseThreadN(3);

        const eventData = await getGameFinishedDataAfterTimeOut(catchFoodGame);
        expect(eventData.playerRanks[0].finished).toBeTruthy();
        expect(eventData.playerRanks[0].dead).toBeFalsy();
        expect(eventData.playerRanks[1].dead).toBeTruthy(); //should be dead cause caught (cause didn't run)
        expect(eventData.playerRanks[2].dead).toBeFalsy();
        expect(eventData.playerRanks[3].dead).toBeFalsy();
    });
});

async function getGameFinishedDataAfterTimeOut(catchFoodGame: CatchFoodGame) {
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
    
    //avoid being caught (for this test)
    jest.spyOn(catchFoodGame as any, 'updateChasersPosition').mockImplementation(() => 0);
    // Time out game
    advanceCountdown(catchFoodGame.timeOutLimit);
    await releaseThreadN(3);
    jest.runAllTimers();
    return eventData;
}
