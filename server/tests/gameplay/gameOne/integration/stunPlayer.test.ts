import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { leaderboard, roomId } from '../../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, finishPlayer, releaseThread, releaseThreadN,
    startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';

let gameOne: GameOne;
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
        gameOne['stunPlayer']('1', '2');
        advanceCountdown(gameOne.stunnedTime);
        await releaseThread();
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('stun time should resume after pause and finish on time', async () => {
        gameOne['stunPlayer']('1', '2');
        gameOne.pauseGame();
        advanceCountdown(gameOne.stunnedTime * 2);
        await releaseThread();
        gameOne.resumeGame();
        await releaseThreadN(3);
        advanceCountdown(gameOne.stunnedTime);
        await releaseThread();
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(gameOne, '1');
        gameOne['stunPlayer']('1', '2');
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('stunPlayer should not set a finished player as stunned', async () => {
        finishPlayer(gameOne, '1');
        gameOne['stunPlayer']('1', '2');
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('should not stun a player who is already stunned', async () => {
        finishPlayer(gameOne, '1');
        gameOne['stunPlayer']('1', '2');
        advanceCountdown(2000);
        await releaseThread();
        gameOne['stunPlayer']('1', '2');
        advanceCountdown(1000);
        await releaseThread();
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });

    it('should not stun a player who is at an obstacle', async () => {
        finishPlayer(gameOne, '1');
        gameOne['runForward']('1', gameOne.trackLength);
        gameOne['stunPlayer']('1', '2');
        expect(gameOne.players.get('1')!.stunned).toBeFalsy();
    });
});
