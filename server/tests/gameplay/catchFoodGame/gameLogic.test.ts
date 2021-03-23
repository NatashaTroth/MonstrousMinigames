import { CatchFoodGame } from '../../../src/gameplay'
import { users } from '../mockUsers'

const TRACKLENGTH = 500
const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame

describe('Game logic tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
    })

    it('starts players at positionX 0', async () => {
        catchFoodGame.startGame()
        expect(catchFoodGame.playersState['1'].positionX).toBe(0)
    })

    it('gameStartedTime is now', async () => {
        catchFoodGame.startGame()
        const gameStartTimeStr = catchFoodGame.gameStartedTime.toString()
        const timeNowStr = Date.now().toString()
        //Remove last 2 digits (could be slight difference)
        expect(gameStartTimeStr.substr(0, gameStartTimeStr.length - 2)).toBe(
            timeNowStr.substr(0, gameStartTimeStr.length - 2)
        )
    })

    it('moves players forward when runForward is called', async () => {
        const SPEED = 10
        catchFoodGame.startGame()
        catchFoodGame.runForward('1', SPEED)
        expect(catchFoodGame.playersState['1'].positionX).toBe(SPEED)
    })

    it('moves players forward correctly when runForward is called multiple times', async () => {
        catchFoodGame.startGame()
        catchFoodGame.runForward('1', 10)
        catchFoodGame.runForward('1', 5)
        expect(catchFoodGame.playersState['1'].positionX).toBe(15)
    })

    it('playerHasReachedObstacle is called and returns false', async () => {
        catchFoodGame.startGame()
        const playerHasReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasReachedObstacle')
        catchFoodGame.runForward('1', 5)
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled()
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(false)
    })

    it('recognises when player has reached an obstacle', async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(catchFoodGame.playersState['1'].atObstacle).toBeTruthy()
    })

    it('playerHasReachedObstacle is called and returns true', async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        const playerHasReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasReachedObstacle')
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled()
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(true)
    })

    it('handlePlayerReachedObstacle is called', async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        const handlePlayerReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'handlePlayerReachedObstacle')
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(handlePlayerReachedObstacleSpy).toHaveBeenCalled()
    })

    it("doesn't remove an obstacle when a player arrives at it", async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(4)
    })

    it("doesn't allow players to move when they reach an obstacle", async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)

        const tmpPlayerPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', 50)
        expect(catchFoodGame.playersState['1'].positionX).toBe(tmpPlayerPositionX)
    })

    it('should recognise when a player has completed an obstacle', async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        catchFoodGame.playerHasCompletedObstacle('1')
        expect(catchFoodGame.playersState['1'].atObstacle).toBeFalsy()
    })

    it('should remove a completed obstacle', async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        catchFoodGame.playerHasCompletedObstacle('1')
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(3)
    })

    it('can move a player again when obstacle is completed', async () => {
        catchFoodGame.startGame()
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        catchFoodGame.playerHasCompletedObstacle('1')
        const tmpPlayerPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', 5)
        expect(catchFoodGame.playersState['1'].positionX).toBe(tmpPlayerPositionX + 5)
    })

    it('should have not obstacles left when the player has completed them', async () => {
        catchFoodGame.startGame()
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
        }
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(0)
    })

    it('should set a player as finished when they have reached the end of the race', async () => {
        catchFoodGame.startGame()
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(catchFoodGame.playersState['1'].finished).toBeTruthy()
    })

    it('playerHasPassedGoal is called and returns false', async () => {
        catchFoodGame.startGame()
        const playerHasPassedGoalSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasPassedGoal')
        catchFoodGame.runForward('1', 5)
        expect(playerHasPassedGoalSpy).toHaveBeenCalled()
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(false)
    })

    it('should set a player as finished when they have reached the end of the race', async () => {
        catchFoodGame.startGame()
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(catchFoodGame.playersState['1'].finished).toBeTruthy()
    })

    it('playerHasPassedGoal is called and returns true', async () => {
        catchFoodGame.startGame()
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
        }

        const playerHasPassedGoalSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasPassedGoal')
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(playerHasPassedGoalSpy).toHaveBeenCalled()
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(true)
    })

    it('playerHasFinishedGame is called', async () => {
        catchFoodGame.startGame()
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
        }

        const playerHasFinishedGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasFinishedGame')
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(playerHasFinishedGameSpy).toHaveBeenCalled()
    })

    it('should have a current rank of 2 after the first player has finished', async () => {
        catchFoodGame.startGame()
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1')
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(catchFoodGame.currentRank).toBe(2)
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

        catchFoodGame.runForward('1', TRACKLENGTH)
        catchFoodGame.runForward('2', TRACKLENGTH)
        catchFoodGame.runForward('3', TRACKLENGTH)
        catchFoodGame.runForward('4', TRACKLENGTH)
        return catchFoodGame
    }

    it('all players should be marked as finished', async () => {
        catchFoodGame = finishGame(catchFoodGame)
        expect(catchFoodGame.playersState['1'].finished).toBeTruthy()
        expect(catchFoodGame.playersState['2'].finished).toBeTruthy()
        expect(catchFoodGame.playersState['3'].finished).toBeTruthy()
        expect(catchFoodGame.playersState['4'].finished).toBeTruthy()
    })

    it('should give the second player that finishes a rank of 2', async () => {
        catchFoodGame = finishGame(catchFoodGame)
        expect(catchFoodGame.playersState['2'].rank).toBe(2)
    })

    it('should give the third player that finishes a rank of 3', async () => {
        catchFoodGame = finishGame(catchFoodGame)
        expect(catchFoodGame.playersState['3'].rank).toBe(3)
    })

    it('should give the fourth player that finishes a rank of 4', async () => {
        catchFoodGame = finishGame(catchFoodGame)
        expect(catchFoodGame.playersState['4'].rank).toBe(4)
    })
})
