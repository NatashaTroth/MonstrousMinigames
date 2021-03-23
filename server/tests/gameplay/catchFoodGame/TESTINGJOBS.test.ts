import { CatchFoodGame } from '../../../src/gameplay'
import { users } from '../mockUsers'

const TRACKLENGTH = 500
const NEW_TRACKLENGTH = 1000
const NUMBER_OF_OBSTACLES = 4
const NEW_NUMBER_OF_OBSTACLES = 6
let catchFoodGame: CatchFoodGame

describe('Reset Game tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        jest.useFakeTimers()
        finishGame(catchFoodGame)
        catchFoodGame.resetGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES)
    })

    function finishGame(catchFoodGame: CatchFoodGame) {
        catchFoodGame.startGame()
        // finish game
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
            catchFoodGame.playerHasCompletedObstacle('2')
            catchFoodGame.playerHasCompletedObstacle('3')
            catchFoodGame.playerHasCompletedObstacle('4')
        }

        catchFoodGame.runForward('1', 500)
        catchFoodGame.runForward('2', 500)
        catchFoodGame.runForward('3', 500)
        catchFoodGame.runForward('4', 500)
        return catchFoodGame
    }

    it('should have the correct new number of players', async () => {
        expect(Object.keys(catchFoodGame.playersState).length).toBe(users.length)
    })

    it('should have the correct tracklength', async () => {
        expect(catchFoodGame.trackLength).toBe(NEW_TRACKLENGTH)
    })
})
