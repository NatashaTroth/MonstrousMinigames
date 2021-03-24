import { CatchFoodGame } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/interfaces';
import { users } from '../mockUsers';
import { startGame } from './startGame';

const TRACKLENGTH = 500
const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame

describe('Change and verify game state', () => {
    beforeEach(async () => {
        catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        jest.useFakeTimers()
    })

    it("shouldn't be able to move player until game has started", async () => {
        // expect(() => catchFoodGame.runForward("1")).toThrow();
        const initialPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('50')
        expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX)
    })

    it("shouldn't be able to complete obstacle until game has started", async () => {
        const obstacleCompleted = catchFoodGame.playersState['1'].obstacles.length
        catchFoodGame.playerHasCompletedObstacle('1')
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(obstacleCompleted)
    })

    it("shouldn't be able to stop game unless game has started", async () => {
        catchFoodGame.stopGame()
        expect(catchFoodGame.gameState).toBe(GameState.Created)
    })

    it('should have a GameState of Started when the game is started', async () => {
        startGame(catchFoodGame)
        expect(catchFoodGame.gameState).toBe(GameState.Started)
    })

    it('should have a GameState of Stopped when the game is stopped', async () => {
        startGame(catchFoodGame)
        catchFoodGame.stopGame()
        expect(catchFoodGame.gameState).toBe(GameState.Stopped)
    })

    it('should have a GameState of Finished when the game is finished', async () => {
        startGame(catchFoodGame)
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

        expect(catchFoodGame.gameState).toBe(GameState.Finished)
    })

    it('should have a GameState of Created when the game is reset', async () => {
        startGame(catchFoodGame)
        catchFoodGame.stopGame()
        catchFoodGame.resetGame(users)
        expect(catchFoodGame.gameState).toBe(GameState.Created)
    })
})
