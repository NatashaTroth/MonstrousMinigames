import 'reflect-metadata';

import { GameOne } from '../../../src/gameplay';
import { DisconnectedUserError } from '../../../src/gameplay/customErrors';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let gameOne: GameOne;

describe('DisconnectedUserError handling tests', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('DisconnectedUserError has userId property of disconnected user', async () => {
        const SPEED = 50;
        const userId = '1';
        startGameAndAdvanceCountdown(gameOne);
        gameOne['runForward'](userId, SPEED);
        gameOne.disconnectPlayer(userId);

        try {
            gameOne['runForward'](userId);
        } catch (e: any) {
            expect(e.userId).toBe(userId);
        }
    });

    it('throws a DisconnectedUserError when runForward is called on a disconnected user', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(gameOne);
        gameOne['runForward']('1', SPEED);
        gameOne.disconnectPlayer('1');

        expect(() => gameOne['runForward']('1')).toThrow(DisconnectedUserError);
    });
    it('throws a DisconnectedUserError when trying to complete an obstacle when disconnected', async () => {
        startGameAndAdvanceCountdown(gameOne);
        completeNextObstacle(gameOne, '1');
        gameOne.disconnectPlayer('1');
        expect(() => gameOne['playerHasCompletedObstacle']('1', gameOne.players.get('1')!.obstacles[0].id)).toThrow(
            DisconnectedUserError
        );
    });
});
