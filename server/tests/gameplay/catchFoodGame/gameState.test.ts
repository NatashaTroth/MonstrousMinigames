import { CatchFoodGame } from '../../../src/gameplay';
import { verifyGameState } from '../../../src/gameplay/helperFunctions/verifyGameState';
import { GameState } from '../../../src/gameplay/interfaces';
import { users } from '../mockUsers';
import { startGameAndAdvanceCountdown } from './startGame';

const TRACKLENGTH = 500
const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame

describe('Change and verify game state', () => {
    beforeEach(async () => {
        catchFoodGame = new CatchFoodGame()
        jest.useFakeTimers()
    })

    it("initialises state as initialised", async () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised)
    })
    
    it("initialises state as initialised", async () => {
        catchFoodGame.createNewGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        expect(catchFoodGame.gameState).toBe(GameState.Created)

    })

    it("shouldn't be able to move player until game has started", async () => {
        // expect(() => catchFoodGame.runForward("1")).toThrow();
        // const initialPositionX = catchFoodGame.playersState['1'].positionX
        // const verifyGameStateSpy = jest.spyOn('verifyGameState')
        // catchFoodGame.runForward('1')
        // expect(verifyGameStateSpy).toHaveBeenCalled()
        expect(() => verifyGameState(catchFoodGame.gameState, GameState.Started)).toThrow()
        // expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX)
    })

    // it("shouldn't be able to move player until game has started", async () => {
    //     // expect(() => catchFoodGame.runForward("1")).toThrow();
    //     const initialPositionX = catchFoodGame.playersState['1'].positionX
    //     catchFoodGame.runForward('50')
    //     expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX)
    // })

    it("shouldn't be able to move player until game has started and the countdown has run", async () => {
        catchFoodGame.createNewGame(users, 500, 4)
        const initialPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('50')
        expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX)
    })

    it("should be able to move player once game has started and the countdown has run", async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const initialPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('50')
        expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX)
    })

    // it("shouldn't be able to complete obstacle until game has started", async () => {
    //     const obstacleCompleted = catchFoodGame.playersState['1'].obstacles.length
    //     catchFoodGame.playerHasCompletedObstacle('1', 0)
    //     expect(catchFoodGame.playersState['1'].obstacles.length).toBe(obstacleCompleted)
    // })

    it("shouldn't be able to stop game unless game has started", async () => {
        catchFoodGame.stopGame()
        expect(catchFoodGame.gameState).toBe(GameState.Initialised)
    })


    it('should not have a GameState of Started until the game has started and countdown has run', async () => {
        catchFoodGame.createNewGame(users)
        expect(catchFoodGame.gameState).toBe(GameState.Created)
        
    })

    it('should have a GameState of Started when the game is started and countdown has run', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        jest.advanceTimersByTime(catchFoodGame.countdownTime)
        expect(catchFoodGame.gameState).toBe(GameState.Started)
    })

    it('should have a GameState of Stopped when the game is stopped', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        catchFoodGame.stopGame()
        expect(catchFoodGame.gameState).toBe(GameState.Stopped)
    })

    it('should have a GameState of Finished when the game is finished', async () => {
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

        expect(catchFoodGame.gameState).toBe(GameState.Finished)
    })

    it('should have a GameState of Created when new game is created', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        catchFoodGame.stopGame()
        catchFoodGame.createNewGame(users)
        expect(catchFoodGame.gameState).toBe(GameState.Created)
    })
})
