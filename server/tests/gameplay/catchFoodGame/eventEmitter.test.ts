// import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEventTypes } from '../../../src/gameplay/interfaces';
import { users } from '../mockUsers';
import { startGameAndAdvanceCountdown } from './startGame';

const TRACKLENGTH = 500
const NUMBER_OF_OBSTACLES = 4
let catchFoodGame: CatchFoodGame
let gameEventEmitter: CatchFoodGameEventEmitter

describe('Event Emitter', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance()
    })

    beforeEach(() => {
        catchFoodGame = new CatchFoodGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES)
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runAllTimers()
    })

    it('should emit a GameHasStarted event when the game is started', async () => {
        //Game started
        let gameStartedEvent = false
        gameEventEmitter.on(GameEventTypes.GameHasStarted, () => {
            gameStartedEvent = true
        })
        expect(gameStartedEvent).toBeFalsy()
        startGameAndAdvanceCountdown(catchFoodGame)
        await setTimeout(() => ({}), 100)
        expect(gameStartedEvent).toBeTruthy()
    })

    it('should emit an ObstacleReached event when an obstacle is reached', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)

        let obstacleEventReceived = false
        gameEventEmitter.on(GameEventTypes.ObstacleReached, () => {
            obstacleEventReceived = true
        })

        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(obstacleEventReceived).toBeTruthy()
    })

    it('should emit an PlayerHasFinished event when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }

        let playerFinished = false
        gameEventEmitter.on(GameEventTypes.PlayerHasFinished, () => {
            playerFinished = true
        })
        catchFoodGame.runForward('1', 500)
        expect(playerFinished).toBeTruthy()
    })

    it('should emit a GameHasFinished event when a all the players have finished race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        let gameFinishedEvent = false
        gameEventEmitter.on(GameEventTypes.GameHasFinished, () => {
            gameFinishedEvent = true
        })
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
        expect(gameFinishedEvent).toBeTruthy()
    })

    it('should emit a GameHasTimedOut event when the game has timed out', async () => {
        let gameTimedOutEvent = false
        gameEventEmitter.on(GameEventTypes.GameHasTimedOut, () => {
            gameTimedOutEvent = true
        })
        startGameAndAdvanceCountdown(catchFoodGame)
        jest.runAllTimers()
        expect(gameTimedOutEvent).toBeTruthy()
    })
})
