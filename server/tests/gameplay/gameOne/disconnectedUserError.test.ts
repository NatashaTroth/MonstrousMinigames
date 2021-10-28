import 'reflect-metadata';

import { GameOne } from '../../../src/gameplay';
import { DisconnectedUserError } from '../../../src/gameplay/customErrors';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: GameOne;

describe('DisconnectedUserError handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('DisconnectedUserError has userId property of disconnected user', async () => {
        const SPEED = 50;
        const userId = '1';
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame['runForward'](userId, SPEED);
        catchFoodGame.disconnectPlayer(userId);

        try {
            catchFoodGame['runForward'](userId);
        } catch (e: any) {
            expect(e.userId).toBe(userId);
        }
    });

    it('throws a DisconnectedUserError when runForward is called on a disconnected user', async () => {
        const SPEED = 50;
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame['runForward']('1', SPEED);
        catchFoodGame.disconnectPlayer('1');

        expect(() => catchFoodGame['runForward']('1')).toThrow(DisconnectedUserError);
    });
    it('throws a DisconnectedUserError when trying to complete an obstacle when disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        completeNextObstacle(catchFoodGame, '1');
        catchFoodGame.disconnectPlayer('1');
        expect(() =>
            catchFoodGame['playerHasCompletedObstacle']('1', catchFoodGame.players.get('1')!.obstacles[0].id)
        ).toThrow(DisconnectedUserError);
    });
});
