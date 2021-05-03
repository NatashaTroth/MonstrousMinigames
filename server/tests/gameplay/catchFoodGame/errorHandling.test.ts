import { CatchFoodGame } from '../../../src/gameplay';
import { MaxNumberUsersExceededError } from '../../../src/gameplay/customErrors';
import { users } from '../mockUsers';

let catchFoodGame: CatchFoodGame;

describe('Error handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    it('throws an error when game is created with more than 4 players', () => {
        const longerUsers = [
            ...users,
            {
                id: '5',
                name: 'Lavender',
                roomId: 'xxx',
                timestamp: 4242,
            },
        ];
        expect(() => catchFoodGame.createNewGame(longerUsers)).toThrowError(MaxNumberUsersExceededError);
    });

    it('throws an error when game is created with more than 4 players with the max number of users', () => {
        const longerUsers = [
            ...users,
            {
                id: '5',
                name: 'Lavender',
                roomId: 'xxx',
                timestamp: 4242,
            },
        ];
        try {
            catchFoodGame.createNewGame(longerUsers);
        } catch (e) {
            expect(e.maxNumberOfUsers).toBe(catchFoodGame.maxNumberOfPlayers);
        }
    });
});
