import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import {
    NotAtObstacleError, WrongObstacleIdError
} from '../../../../src/gameplay/gameOne/customErrors';
import { leaderboard, roomId } from '../../mockData';
import {
    clearTimersAndIntervals, goToNextUnsolvableObstacle, startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';

let gameOne: GameOne;
const USER_ID = '1';
const OBSTACLE_ID_THAT_IS_NEXT = 0;
const OBSTACLE_ID_THAT_IS_NOT_NEXT = 1;
const OBSTACLE_ID_THAT_DOES_NOT_EXIST = 50;

describe('NotAtObstacleError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        startGameAndAdvanceCountdown(gameOne);
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('the NotAtObstacleError has a userId property', async () => {
        try {
            gameOne['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_IS_NEXT);
        } catch (e: any) {
            expect(e.userId).toBe(USER_ID);
        }
    });

    it('throws a NotAtObstacleError when trying complete an obstacle and the user is not at an obstacle', async () => {
        expect(() => gameOne['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_IS_NEXT)).toThrow(
            NotAtObstacleError
        );
    });
});

describe('WrongObstacleIdError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
        startGameAndAdvanceCountdown(gameOne);
        goToNextUnsolvableObstacle(gameOne, USER_ID);
    });

    it('the WrongObstacleIdError has a userId and obstacleId property', async () => {
        try {
            gameOne['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_DOES_NOT_EXIST);
        } catch (e: any) {
            expect(e.userId).toBe(USER_ID);
            expect(e.obstacleId).toBe(OBSTACLE_ID_THAT_DOES_NOT_EXIST);
        }
    });

    it('throws a WrongObstacleIdError when trying complete an obstacle that is not next on the list', async () => {
        expect(() => gameOne['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_IS_NOT_NEXT)).toThrow(
            WrongObstacleIdError
        );
    });

    it('throws a WrongObstacleIdError when trying complete an obstacle that is not on the list at all', async () => {
        expect(() => gameOne['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_DOES_NOT_EXIST)).toThrow(
            WrongObstacleIdError
        );
    });
});
