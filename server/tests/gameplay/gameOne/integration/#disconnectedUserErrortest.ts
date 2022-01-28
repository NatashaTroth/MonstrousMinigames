import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { DisconnectedUserError } from '../../../../src/gameplay/customErrors';
import { leaderboard, roomId } from '../../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from '../gameOneHelperFunctions';
import { playerHasCompletedObstacleMessage, runForwardMessage } from '../gameOneMockData';

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
        // const SPEED = 50;
        const userId = '1';
        startGameAndAdvanceCountdown(gameOne);
        gameOne.receiveInput({ ...runForwardMessage, userId });
        // gameOne['runForward'](userId, SPEED);
        gameOne.disconnectPlayer(userId);

        try {
            gameOne.receiveInput({ ...runForwardMessage, userId });

            // gameOne['runForward'](userId);
        } catch (e: any) {
            expect(e.userId).toBe(userId);
        }
    });

    // fit('throws a DisconnectedUserError when runForward is called on a disconnected user', async () => {
    //     const userId = '1';
    //     startGameAndAdvanceCountdown(gameOne);
    //     gameOne.receiveInput({ ...runForwardMessage, userId });
    //     gameOne.disconnectPlayer('1');

    //     expect(() => gameOne.receiveInput({ ...runForwardMessage, userId })).toThrow(DisconnectedUserError);
    // });
    // it('throws a DisconnectedUserError when trying to complete an obstacle when disconnected', async () => {
    //     startGameAndAdvanceCountdown(gameOne);
    //     gameOne.receiveInput(playerHasCompletedObstacleMessage);
    //     gameOne.disconnectPlayer('1');
    //     expect(() => gameOne.receiveInput(playerHasCompletedObstacleMessage)).toThrow(DisconnectedUserError);
    // });
});
