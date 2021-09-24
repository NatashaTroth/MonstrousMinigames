import 'reflect-metadata';
import { CatchFoodGame } from '../../../src/gameplay';
import {
    NotAtObstacleError, WrongObstacleIdError
} from '../../../src/gameplay/catchFood/customErrors';
import { leaderboard, roomId } from '../mockData';
import { clearTimersAndIntervals, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
const USER_ID = '1';
const OBSTACLE_ID_THAT_IS_NEXT = 0;
const OBSTACLE_ID_THAT_IS_NOT_NEXT = 1;
const OBSTACLE_ID_THAT_DOES_NOT_EXIST = 50;

describe('NotAtObstacleError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        startGameAndAdvanceCountdown(catchFoodGame);
    });

    afterEach(async () => {
        clearTimersAndIntervals(catchFoodGame);
    });

    it('the NotAtObstacleError has a userId property', async () => {
        try {
            catchFoodGame['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_IS_NEXT);
        } catch (e: any) {
            expect(e.userId).toBe(USER_ID);
        }
    });

    it('throws a NotAtObstacleError when trying complete an obstacle an the user is not at an obstacle', async () => {
        expect(() => catchFoodGame['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_IS_NEXT)).toThrow(
            NotAtObstacleError
        );
    });
});

describe('WrongObstacleIdError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        startGameAndAdvanceCountdown(catchFoodGame);
        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle); //atObstacle = true
    });

    it('the WrongObstacleIdError has a userId and obstacleId property', async () => {
        try {
            catchFoodGame['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_DOES_NOT_EXIST);
        } catch (e: any) {
            expect(e.userId).toBe(USER_ID);
            expect(e.obstacleId).toBe(OBSTACLE_ID_THAT_DOES_NOT_EXIST);
        }
    });

    it('throws a WrongObstacleIdError when trying complete an obstacle that is not next on the list', async () => {
        expect(() => catchFoodGame['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_IS_NOT_NEXT)).toThrow(
            WrongObstacleIdError
        );
    });

    it('throws a WrongObstacleIdError when trying complete an obstacle that is not on the list at all', async () => {
        expect(() => catchFoodGame['playerHasCompletedObstacle'](USER_ID, OBSTACLE_ID_THAT_DOES_NOT_EXIST)).toThrow(
            WrongObstacleIdError
        );
    });
});
