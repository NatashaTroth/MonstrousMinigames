import { CatchFoodGame } from '../../../src/gameplay'
import { users } from '../mockUsers'

const TRACKLENGTH = 500
const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame

describe('Error handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        jest.useFakeTimers()
        // finishGame(catchFoodGame);
        // catchFoodGame.resetGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES);
    })

    //TODO

    it('needs to be implemented', () => {
        catchFoodGame.startGame()
        expect(true).toBeTruthy()
    })

    // it("throw an error if userId is not registered to the game", async () => {
    //   catchFoodGame.startGame();
    // try {
    //   catchFoodGame.runForward("notUserId");
    //   expect(true).toBeFalsy();
    // } catch (e) {
    //   //yaay, error was thrown
    // }
    // try {
    //   catchFoodGame.playerHasCompletedObstacle("notUserId");
    //   expect(true).toBeFalsy();
    // } catch (e) {
    //   //yaay, error was thrown
    // }
    // });
})
