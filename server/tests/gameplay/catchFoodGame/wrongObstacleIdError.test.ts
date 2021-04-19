import { CatchFoodGame } from '../../../src/gameplay';
import { WrongObstacleIdError } from '../../../src/gameplay/catchFood/customErrors';
import { startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
const USER_ID = '1';
const OBSTACLE_ID_THAT_DOES_NOT_EXIST = 50;

describe('WrongObstacleIdError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame();
        startGameAndAdvanceCountdown(catchFoodGame);
    });

    it('the WrongObstacleIdError has a userId and obstacleId property', async () => {
        try {
            catchFoodGame.playerHasCompletedObstacle(USER_ID, OBSTACLE_ID_THAT_DOES_NOT_EXIST);
        } catch (e) {
            expect(e.userId).toBe(USER_ID);
            expect(e.obstacleId).toBe(OBSTACLE_ID_THAT_DOES_NOT_EXIST);
        }
    });

    it('throws a WrongObstacleIdError when trying complete an obstacle that is not next on the list (or is not on the list at all)', async () => {
        expect(() => catchFoodGame.playerHasCompletedObstacle(USER_ID, OBSTACLE_ID_THAT_DOES_NOT_EXIST)).toThrow(
            WrongObstacleIdError
        );
    });
});
