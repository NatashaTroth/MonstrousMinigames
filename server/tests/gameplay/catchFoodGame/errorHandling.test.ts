import User from '../../../src/classes/user';
import { CatchFoodGame } from '../../../src/gameplay';
import { MaxNumberUsersExceededError } from '../../../src/gameplay/customErrors';
import { leaderboard, roomId, users } from '../mockData';

let catchFoodGame: CatchFoodGame;
const longerUsers = [...users, new User('xxx', 'iii', 'Lavender', '5')];

describe('Error handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error when game is created with more than 4 players', () => {
        expect(() => catchFoodGame.createNewGame(longerUsers)).toThrowError(MaxNumberUsersExceededError);
    });

    it('throws an error when game is created with more than 4 players with the max number of users', () => {
        try {
            catchFoodGame.createNewGame(longerUsers);
        } catch (e) {
            expect(e.maxNumberOfUsers).toBe(catchFoodGame.maxNumberOfPlayers);
        }
    });
});
