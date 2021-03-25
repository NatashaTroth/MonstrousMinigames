import { CatchFoodGame } from '../../../src/gameplay';
import { users } from '../mockUsers';
import { startGameAndAdvanceCountdown } from './startGame';

const TRACKLENGTH = 500
const NEW_TRACKLENGTH = 1000
const NUMBER_OF_OBSTACLES = 4
const NEW_NUMBER_OF_OBSTACLES = 6
let catchFoodGame: CatchFoodGame

describe('Create new game tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame()
        catchFoodGame.createNewGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        jest.useFakeTimers()
        finishGame(catchFoodGame)
        catchFoodGame.createNewGame(users, NEW_TRACKLENGTH, NEW_NUMBER_OF_OBSTACLES)
    })

    function finishGame(catchFoodGame: CatchFoodGame) {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish game
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
            catchFoodGame.playerHasCompletedObstacle('2', i)
            catchFoodGame.playerHasCompletedObstacle('3', i)
            catchFoodGame.playerHasCompletedObstacle('4', i)
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

    it('should have the correct current rank', async () => {
        expect(catchFoodGame.currentRank).toBe(1)
    })

    it('should have the correct name for player 1', async () => {
        expect(catchFoodGame.playersState['1'].name).toBe(users[0].name)
    })

    it('should have a player not at an obstacle', async () => {
        expect(catchFoodGame.playersState['1'].atObstacle).toBeFalsy()
    })

    it('should set the player to not be finished', async () => {
        expect(catchFoodGame.playersState['1'].finished).toBeFalsy()
    })

    it('should have initiated the correct new number of obstacles', async () => {
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(6)
    })
})
