import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEventTypes, GameHasFinished, GameState } from '../../../src/gameplay/interfaces';
import { startGameAndAdvanceCountdown } from './startGame';

const TRACKLENGTH = 500

let catchFoodGame: CatchFoodGame
let gameEventEmitter: CatchFoodGameEventEmitter;
const dateNow = 1618665766156;


describe('Game logic tests', () => {
    beforeEach(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
        catchFoodGame = new CatchFoodGame()
        jest.useFakeTimers()
    })

    it('starts players at positionX 0', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        expect(catchFoodGame.playersState['1'].positionX).toBe(0)
    })

    it('gameStartedTime is now', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const gameStartTimeStr = catchFoodGame.gameStartedTime.toString()
        const timeNowStr = Date.now().toString()
        //Remove last 2 digits (could be slight difference)
        expect(gameStartTimeStr.substr(0, gameStartTimeStr.length - 2)).toBe(
            timeNowStr.substr(0, gameStartTimeStr.length - 2)
        )
    })

    it('moves players forward when runForward is called', async () => {
        const SPEED = 10
        startGameAndAdvanceCountdown(catchFoodGame)
        catchFoodGame.runForward('1', SPEED)
        expect(catchFoodGame.playersState['1'].positionX).toBe(SPEED)
    })

    it('moves players forward correctly when runForward is called multiple times', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        catchFoodGame.runForward('1', 10)
        catchFoodGame.runForward('1', 5)
        expect(catchFoodGame.playersState['1'].positionX).toBe(15)
    })

    it('playerHasReachedObstacle is called and returns false', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const playerHasReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasReachedObstacle')
        catchFoodGame.runForward('1', 5)
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled()
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(false)
    })

    it('recognises when player has reached an obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(catchFoodGame.playersState['1'].atObstacle).toBeTruthy()
    })

    it('playerHasReachedObstacle is called and returns true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        const playerHasReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasReachedObstacle')
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(playerHasReachedObstacleSpy).toHaveBeenCalled()
        expect(playerHasReachedObstacleSpy).toHaveReturnedWith(true)
    })

    it('handlePlayerReachedObstacle is called', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        const handlePlayerReachedObstacleSpy = jest.spyOn(CatchFoodGame.prototype as any, 'handlePlayerReachedObstacle')
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(handlePlayerReachedObstacleSpy).toHaveBeenCalled()
    })

    it("doesn't remove an obstacle when a player arrives at it", async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(4)
    })

    it("doesn't allow players to move when they reach an obstacle", async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)

        const tmpPlayerPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', 50)
        expect(catchFoodGame.playersState['1'].positionX).toBe(tmpPlayerPositionX)
    })

    it('should recognise when a player has completed an obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        catchFoodGame.playerHasCompletedObstacle('1', 0)
        expect(catchFoodGame.playersState['1'].atObstacle).toBeFalsy()
    })

    it('should remove a completed obstacle', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        catchFoodGame.playerHasCompletedObstacle('1', 0)
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(3)
    })

    it('can move a player again when obstacle is completed', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', distanceToObstacle)
        catchFoodGame.playerHasCompletedObstacle('1', 0)
        const tmpPlayerPositionX = catchFoodGame.playersState['1'].positionX
        catchFoodGame.runForward('1', 5)
        expect(catchFoodGame.playersState['1'].positionX).toBe(tmpPlayerPositionX + 5)
    })

    it('should have not obstacles left when the player has completed them', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(0)
    })

    it('should set a player as finished when they have reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(catchFoodGame.playersState['1'].finished).toBeTruthy()
    })

    it('playerHasPassedGoal is called and returns false', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        const playerHasPassedGoalSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasPassedGoal')
        catchFoodGame.runForward('1', 5)
        expect(playerHasPassedGoalSpy).toHaveBeenCalled()
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(false)
    })

    it('should set a player as finished when they have reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(catchFoodGame.playersState['1'].finished).toBeTruthy()
    })

    it('playerHasPassedGoal is called and returns true', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }

        const playerHasPassedGoalSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasPassedGoal')
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(playerHasPassedGoalSpy).toHaveBeenCalled()
        expect(playerHasPassedGoalSpy).toHaveReturnedWith(true)
    })

    it('playerHasFinishedGame is called', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }

        const playerHasFinishedGameSpy = jest.spyOn(CatchFoodGame.prototype as any, 'playerHasFinishedGame')
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(playerHasFinishedGameSpy).toHaveBeenCalled()
    })

    it('should have a current rank of 2 after the first player has finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        expect(catchFoodGame.currentRank).toBe(2)
    })

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

    it('creates game finished event with the correct properties', async () => {
        const eventData = getGameFinishedData(catchFoodGame)
        const expectedEventObj = {
            roomId: catchFoodGame.roomId,
            gameState: GameState.Finished,
            trackLength: catchFoodGame.trackLength,
            numberOfObstacles: catchFoodGame.numberOfObstacles
        }

        expect(eventData).toMatchObject(expectedEventObj)
        expect(eventData).toHaveProperty('playerRanks')
    })

    it('creates game finished event with the correct playerRanks properties', async () => {
        const eventData = getGameFinishedData(catchFoodGame)
        expect(eventData.playerRanks[0].name).toBe(catchFoodGame.playersState["1"].name)
        expect(eventData.playerRanks[0].finished).toBeTruthy()
        expect(eventData.playerRanks[0].positionX).toBe(catchFoodGame.playersState["1"].positionX)
    })

    it('creates game finished event with the correct playerRanks totalTimeInMs properties', async () => {
        const eventData = getGameFinishedData(catchFoodGame)
        expect(eventData.playerRanks[0].totalTimeInMs).toBe(1000)
        expect(eventData.playerRanks[1].totalTimeInMs).toBe(5000)
        expect(eventData.playerRanks[2].totalTimeInMs).toBe(10000)
        expect(eventData.playerRanks[3].totalTimeInMs).toBe(15000)

    })

    it('creates game finished event with the correct playerRanks', async () => {
        const eventData = getGameFinishedData(catchFoodGame)
        expect(eventData.playerRanks[0].rank).toBe(1)
        expect(eventData.playerRanks[1].rank).toBe(2)
        expect(eventData.playerRanks[2].rank).toBe(3)
        expect(eventData.playerRanks[3].rank).toBe(4)
    })

    it('creates game finished event where first 3 players have the same ranks', async () => {
        Date.now = jest.fn(() => dateNow);
        const eventData = getGameFinishedDataSameRanks(catchFoodGame)
        expect(eventData.playerRanks[0].rank).toBe(1)
        expect(eventData.playerRanks[1].rank).toBe(1)
        expect(eventData.playerRanks[2].rank).toBe(1)
        expect(eventData.playerRanks[3].rank).toBe(4)
    })


    function finishGame(catchFoodGame: CatchFoodGame) {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish game
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
            catchFoodGame.playerHasCompletedObstacle('2', i)
            catchFoodGame.playerHasCompletedObstacle('3', i)
            catchFoodGame.playerHasCompletedObstacle('4', i)
        }
        Date.now = jest.fn(() => dateNow + 1000);
        catchFoodGame.runForward('1', TRACKLENGTH)
        Date.now = jest.fn(() => dateNow + 5000);
        catchFoodGame.runForward('2', TRACKLENGTH)
        Date.now = jest.fn(() => dateNow + 10000);
        catchFoodGame.runForward('3', TRACKLENGTH)
        Date.now = jest.fn(() => dateNow + 15000);
        catchFoodGame.runForward('4', TRACKLENGTH)
        return catchFoodGame
    }



    function getGameFinishedData(catchFoodGame: CatchFoodGame): GameHasFinished{
        let eventData: GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            trackLength: 0,
            numberOfObstacles: 0,
            playerRanks: [],
        };
    
        gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameHasFinished) => {
            eventData = data;
        });

        catchFoodGame = finishGame(catchFoodGame)
        return eventData
    }

    function getGameFinishedDataSameRanks(catchFoodGame: CatchFoodGame){
        let eventData: GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            trackLength: 0,
            numberOfObstacles: 0,
            playerRanks: [],
        };

        
        
        gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameHasFinished) => {
            eventData = data;
        });
        
        startGameAndAdvanceCountdown(catchFoodGame)
        // finish game
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i)
            catchFoodGame.playerHasCompletedObstacle('2', i)
            catchFoodGame.playerHasCompletedObstacle('3', i)
            catchFoodGame.playerHasCompletedObstacle('4', i)
        }
        catchFoodGame.runForward('1', TRACKLENGTH)
        catchFoodGame.runForward('2', TRACKLENGTH)
        catchFoodGame.runForward('3', TRACKLENGTH)
        Date.now = jest.fn(() => dateNow + 15000);
        catchFoodGame.runForward('4', TRACKLENGTH)
    
        return eventData
    }



})
