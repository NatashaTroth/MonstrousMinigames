import { CatchFoodGame } from '../../../src/gameplay';
import { WrongUserIdError } from '../../../src/gameplay/customErrors';
import Leaderboard from '../../../src/gameplay/leaderboard/Leaderboard';
import { users } from '../mockUsers';
import { startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
const USER_ID_THAT_DOES_NOT_EXIST = '50';

describe('WrongUserIdError handling tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        catchFoodGame = new CatchFoodGame();
        startGameAndAdvanceCountdown(catchFoodGame);
    });

    it('the WrongUserIdError has a userId property', async () => {
        try {
            catchFoodGame.runForward(USER_ID_THAT_DOES_NOT_EXIST);
        } catch (e) {
            expect(e.userId).toBe(USER_ID_THAT_DOES_NOT_EXIST);
        }
    });

    it('throws a WrongUserIdError when trying to move a user forward who does not exist', async () => {
        expect(() => catchFoodGame.runForward(USER_ID_THAT_DOES_NOT_EXIST)).toThrow(WrongUserIdError);
    });

    it('throws a WrongUserIdError when trying to complete an obstacle for a user who does not exist', async () => {
        expect(() => catchFoodGame.playerHasCompletedObstacle(USER_ID_THAT_DOES_NOT_EXIST, 1)).toThrow(
            WrongUserIdError
        );
    });

    it('throws a WrongUserIdError when trying to disconnect a user who does not exist', async () => {
        expect(() => catchFoodGame.disconnectPlayer(USER_ID_THAT_DOES_NOT_EXIST)).toThrow(WrongUserIdError);
    });
});

describe('Leaderboard add user points', () => {
    const points = 10;
    const ROOM_ID = '###';
    let leaderboard: Leaderboard;

    beforeEach(() => {
        leaderboard = new Leaderboard(ROOM_ID);
        leaderboard.addUsers(users);
    });

    it('throws a WrongUserIdError when trying to add points to a user who does not exist', async () => {
        const userIdThatDoesNotExist = 'wrong user id';
        expect(() => leaderboard.addUserPoints(userIdThatDoesNotExist, points)).toThrow(WrongUserIdError);
    });
});
