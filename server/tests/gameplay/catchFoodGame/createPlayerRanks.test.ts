import { CatchFoodGame } from '../../../src/gameplay';
import {
    finishGame, getGameFinishedDataDifferentTimes, getGameFinishedDataSameRanks,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

// const TRACKLENGTH = 500;

let catchFoodGame: CatchFoodGame;
const dateNow = 1618665766156;

describe('Game logic tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('createPlayerRanks is called when the game is finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const createPlayerRanksSpy = jest.spyOn(CatchFoodGame.prototype as any, 'createPlayerRanks');
        finishGame(catchFoodGame);
        expect(createPlayerRanksSpy).toHaveBeenCalledTimes(1);
    });

    it('createPlayerRanks is called when the game times out', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const createPlayerRanksSpy = jest.spyOn(CatchFoodGame.prototype as any, 'createPlayerRanks');
        jest.advanceTimersByTime(catchFoodGame.timeOutLimit + 1);
        expect(createPlayerRanksSpy).toHaveBeenCalledTimes(1);
    });

    it('creates game finished event with the correct playerRanks properties', async () => {
        const eventData = getGameFinishedDataDifferentTimes(catchFoodGame);
        expect(eventData.playerRanks[0].name).toBe(catchFoodGame.playersState['1'].name);
        expect(eventData.playerRanks[0].finished).toBeTruthy();
        expect(eventData.playerRanks[0].positionX).toBe(catchFoodGame.playersState['1'].positionX);
    });

    it('creates game finished event with the correct playerRanks totalTimeInMs properties', async () => {
        const eventData = getGameFinishedDataDifferentTimes(catchFoodGame);
        expect(eventData.playerRanks[0].totalTimeInMs).toBe(1000);
        expect(eventData.playerRanks[1].totalTimeInMs).toBe(5000);
        expect(eventData.playerRanks[2].totalTimeInMs).toBe(10000);
        expect(eventData.playerRanks[3].totalTimeInMs).toBe(15000);
    });

    it('creates game finished event with the correct playerRanks', async () => {
        const eventData = getGameFinishedDataDifferentTimes(catchFoodGame);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(2);
        expect(eventData.playerRanks[2].rank).toBe(3);
        expect(eventData.playerRanks[3].rank).toBe(4);
    });

    it('creates game finished event where first 3 players have the same ranks', async () => {
        Date.now = jest.fn(() => dateNow);
        const eventData = getGameFinishedDataSameRanks(catchFoodGame);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(1);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(4);
    });

    it('creates game finished event with isActive property', async () => {
        Date.now = jest.fn(() => dateNow);
        const eventData = getGameFinishedDataSameRanks(catchFoodGame);
        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeTruthy();
        expect(eventData.playerRanks[3].isActive).toBeTruthy();
    });
});
