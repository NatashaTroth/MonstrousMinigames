import { CatchFoodGame } from '../../../src/gameplay';
import { users } from '../mockUsers';

// const TRACKLENGTH = 500
// const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame;

describe('Error handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
        // finishGame(catchFoodGame);
        // catchFoodGame.resetGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES);
    });

    //TODO

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
        expect(() => catchFoodGame.createNewGame(longerUsers)).toThrowError(
            `Too many players. Max ${catchFoodGame.maxNumberOfPlayers} Players`
        );
    });
});
