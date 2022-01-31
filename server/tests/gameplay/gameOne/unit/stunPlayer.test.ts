import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { leaderboard, roomId } from '../../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, finishPlayer, releaseThread, releaseThreadN,
    startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';
import { runForwardMessage, stunPlayerMessage } from '../gameOneMockData';

let gameOne: GameOne;
const userId = '1';
// let gameEventEmitter: GameOneEventEmitter;

describe('Stun player tests', () => {
    beforeEach(() => {
        // gameEventEmitter = GameOneEventEmitter.getInstance();
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
        startGameAndAdvanceCountdown(gameOne, () => {
            gameOne.players.get('2')!.obstacles = gameOne.players
                .get('2')!
                .obstacles.filter(obstacle => obstacle.type === ObstacleType.Stone);
            gameOne.players.get('2')!.stonesCarrying = 3;
        });
    });

    afterEach(() => {
        clearTimersAndIntervals(gameOne);
    });

    // const dateNow = 1618665766156;
    // Date.now = jest.fn(() => dateNow);
    // startGameAndAdvanceCountdown(gameOne);

    it('stunPlayer should be over after stun time', async () => {
        gameOne.receiveInput({ ...stunPlayerMessage });

        advanceCountdown(gameOne, gameOne.stunnedTime);
        await releaseThread();
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('stun time should resume after pause and finish on time', async () => {
        gameOne.receiveInput({ ...stunPlayerMessage });
        gameOne.pauseGame();
        const time = gameOne.stunnedTime * 2;
        const previousNow = Date.now;
        Date.now = () => previousNow() + time;
        jest.advanceTimersByTime(time);
        await releaseThread();
        gameOne.resumeGame();
        await releaseThreadN(3);
        advanceCountdown(gameOne, gameOne.stunnedTime);
        await releaseThread();
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(gameOne, '1');
        gameOne.receiveInput({ ...stunPlayerMessage });

        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(gameOne, '1');
        gameOne.receiveInput({ ...stunPlayerMessage });

        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('should not stun a player who is already stunned', async () => {
        finishPlayer(gameOne, '1');
        gameOne.receiveInput({ ...stunPlayerMessage });

        advanceCountdown(gameOne, 2000);
        await releaseThread();
        gameOne.receiveInput({ ...stunPlayerMessage });

        advanceCountdown(gameOne, 1000);
        await releaseThread();
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('should not stun a player who is at an obstacle', async () => {
        finishPlayer(gameOne, '1');
        gameOne.receiveInput({ ...runForwardMessage, userId });
        gameOne.receiveInput({ ...stunPlayerMessage });
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });
});
