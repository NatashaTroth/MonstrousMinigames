import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { leaderboard, roomId } from '../../mockData';
import {
    clearTimersAndIntervals, getGameFinishedDataDifferentTimes, getGameFinishedDataSameRanks
} from '../gameOneHelperFunctions';

// const TRACK_LENGTH = 5000;  // has to be bigger than initial player position

let gameOne: GameOne;
const dateNow = 1618665766156;

describe('createPlayerRanks test', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard, false);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
        jest.clearAllMocks();
    });

    it('creates game finished event with the correct playerRanks properties', async () => {
        const timesFinished = [1000, 5000, 10000, 15000];
        const eventData = await getGameFinishedDataDifferentTimes(gameOne, timesFinished);
        expect(eventData.playerRanks[0].name).toBe(gameOne.players.get('1')?.name);
        expect(eventData.playerRanks[0].finished).toBeTruthy();
        expect(eventData.playerRanks[0].positionX).toBe(gameOne.players.get('1')?.positionX);
    });

    it('creates game finished event with the correct playerRanks totalTimeInMs properties', async () => {
        const timesFinished = [1000, 5000, 10000, 15000];
        const eventData = await getGameFinishedDataDifferentTimes(gameOne, timesFinished);
        expect(eventData.playerRanks[0].totalTimeInMs).toBe(timesFinished[0]);
        expect(eventData.playerRanks[1].totalTimeInMs).toBe(timesFinished[1]);
        expect(eventData.playerRanks[2].totalTimeInMs).toBe(timesFinished[2]);
        expect(eventData.playerRanks[3].totalTimeInMs).toBe(timesFinished[2]); // same time as the third player, since the game automatically ends when there is only one player left
    });

    it('creates game finished event with the correct playerRanks', async () => {
        const timesFinished = [1000, 5000, 10000, 15000];
        const eventData = await getGameFinishedDataDifferentTimes(gameOne, timesFinished);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(2);
        expect(eventData.playerRanks[2].rank).toBe(3);
        expect(eventData.playerRanks[3].rank).toBe(4);
    });

    it('creates game finished event where first 3 players have the same ranks', async () => {
        Date.now = jest.fn(() => dateNow);
        const eventData = getGameFinishedDataSameRanks(gameOne);
        expect(eventData.playerRanks[0].rank).toBe(1);
        expect(eventData.playerRanks[1].rank).toBe(1);
        expect(eventData.playerRanks[2].rank).toBe(1);
        expect(eventData.playerRanks[3].rank).toBe(4);
    });

    it('creates game finished event with isActive property', async () => {
        Date.now = jest.fn(() => dateNow);
        const eventData = getGameFinishedDataSameRanks(gameOne);
        expect(eventData.playerRanks[0].isActive).toBeTruthy();
        expect(eventData.playerRanks[1].isActive).toBeTruthy();
        expect(eventData.playerRanks[2].isActive).toBeTruthy();
        expect(eventData.playerRanks[3].isActive).toBeTruthy();
    });
});
