// import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { ObstacleType } from '../../../src/gameplay/catchFood/interfaces';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces/';
import { GameEventTypes, GameState } from '../../../src/gameplay/interfaces';
import { finishGame, startGameAndAdvanceCountdown } from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

describe('Event Emitter', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
    });

    // test super is being called
    // it.only('should create a new CatchFoodGameEventEmitter instance (same object)', async () => {
    //     const GameEventEmitterNew = require('../../../src/classes/GameEventEmitter')
    //     jest.mock('../../../src/classes/GameEventEmitter');
    //     const CatchFoodGameEventEmitterNew = require('../../../src/gameplay/catchFood/CatchFoodGameEventEmitter')

    //     // const EventEmitterSuperSpy = jest.spyOn(CatchFoodGameEventEmitterNew.prototype as any, 'constructor')
    //     // const soundPlayerConsumer = new SoundPlayerConsumer();
    //     // expect(SoundPlayer).toHaveBeenCalledTimes(1);
    //     expect(GameEventEmitterNew).toHaveBeenCalledTimes(1)

    //     // CatchFoodGameEventEmitter.mockClear()

    // })

    it('should create a new CatchFoodGameEventEmitter instance (same object)', async () => {
        const gameEventEmitterNew = CatchFoodGameEventEmitter.getInstance();
        expect(gameEventEmitterNew).toBe(gameEventEmitter);
    });

    //---------- Start game ----------

    it('should emit a GameHasStarted event when the game is started', async () => {
        //Game started
        let gameStartedEvent = false;
        gameEventEmitter.on(GameEventTypes.GameHasStarted, () => {
            gameStartedEvent = true;
        });
        expect(gameStartedEvent).toBeFalsy();
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(gameStartedEvent).toBeTruthy();
    });

    it('should emit GameHasStarted data when the game is started', async () => {
        let eventData: GameEvents.GameHasStarted = {
            roomId: '',
            countdownTime: 0,
        };
        gameEventEmitter.on(GameEventTypes.GameHasStarted, (data: GameEvents.GameHasStarted) => {
            eventData = data;
        });

        startGameAndAdvanceCountdown(catchFoodGame);

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            countdownTime: catchFoodGame.countdownTime,
        });
    });

    //---------- Obstacle reached ----------

    it('should emit an ObstacleReached event when an obstacle is reached', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        let obstacleEventReceived = false;
        gameEventEmitter.on(GameEventTypes.ObstacleReached, () => {
            obstacleEventReceived = true;
        });

        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX;
        catchFoodGame.runForward('1', distanceToObstacle);
        expect(obstacleEventReceived).toBeTruthy();
    });

    it('should emit an ObstacleReachedInfo data when an obstacle is reached', async () => {
        let eventData: GameEvents.ObstacleReachedInfo = {
            roomId: '',
            userId: '',
            obstacleId: 1,
            obstacleType: ObstacleType.TreeStump, //null not possible
        };
        gameEventEmitter.on(GameEventTypes.ObstacleReached, (data: GameEvents.ObstacleReachedInfo) => {
            eventData = data;
        });

        startGameAndAdvanceCountdown(catchFoodGame);

        const distanceToObstacle =
            catchFoodGame.playersState['1'].obstacles[0].positionX - catchFoodGame.playersState['1'].positionX;
        catchFoodGame.runForward('1', distanceToObstacle);

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: '1',
            obstacleId: catchFoodGame.playersState['1'].obstacles[0].id,
            obstacleType: catchFoodGame.playersState['1'].obstacles[0].type,
        });
    });

    //---------- Game has paused ----------

    it('should emit a GameHasPaused event when the game has been paused', async () => {
        let gameHasPaused = false;
        gameEventEmitter.on(GameEventTypes.GameHasPaused, () => {
            gameHasPaused = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(gameHasPaused).toBeTruthy();
    });

    it('should emit GameStateHasChanged data when the game has been paused', async () => {
        let eventData: GameEvents.GameStateHasChanged = {
            roomId: '',
        };
        gameEventEmitter.on(GameEventTypes.GameHasPaused, (data: GameEvents.GameStateHasChanged) => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });

    //---------- Game has resumed ----------

    it('should emit a GameHasResumed event when the game has been paused', async () => {
        let gameHasResumed = false;
        gameEventEmitter.on(GameEventTypes.GameHasResumed, () => {
            gameHasResumed = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.resumeGame();
        expect(gameHasResumed).toBeTruthy();
    });

    it('should emit GameStateHasChanged data when the game has resumed', async () => {
        let eventData: GameEvents.GameStateHasChanged = {
            roomId: '',
        };
        gameEventEmitter.on(GameEventTypes.GameHasResumed, (data: GameEvents.GameStateHasChanged) => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.resumeGame();
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });

    //---------- Game has stopped ----------

    it('should emit a GameHasStopped event when the game has been paused', async () => {
        let gameHasStopped = false;
        gameEventEmitter.on(GameEventTypes.GameHasStopped, () => {
            gameHasStopped = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGame();
        expect(gameHasStopped).toBeTruthy();
    });

    it('should emit GameStateHasChanged data when the game has stopped', async () => {
        let eventData: GameEvents.GameStateHasChanged = {
            roomId: '',
        };
        gameEventEmitter.on(GameEventTypes.GameHasStopped, (data: GameEvents.GameStateHasChanged) => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGame();
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });

    //---------- Player has disconnected ----------

    it('should emit a PlayerHasDisconnected event when a player is disconnected', async () => {
        let playerHasDisconnectedEvent = false;
        gameEventEmitter.on(GameEventTypes.PlayerHasDisconnected, () => {
            playerHasDisconnectedEvent = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        expect(playerHasDisconnectedEvent).toBeTruthy();
    });

    it('should emit a roomId and userId when a player is disconnected', async () => {
        let eventData: GameEvents.PlayerHasDisconnectedInfo = {
            roomId: '',
            userId: '',
        };
        gameEventEmitter.on(GameEventTypes.PlayerHasDisconnected, data => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        expect(eventData).toMatchObject({
            roomId: 'xxx',
            userId: '1',
        });
    });

    //---------- Player has finished ----------

    it('should emit an PlayerHasFinished event when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i);
        }

        let playerFinished = false;
        gameEventEmitter.on(GameEventTypes.PlayerHasFinished, () => {
            playerFinished = true;
        });
        catchFoodGame.runForward('1', 500);
        expect(playerFinished).toBeTruthy();
    });

    it('should emit an PlayerHasFinished data when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        // finish player 1
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i);
        }

        let eventData: GameEvents.PlayerHasFinished = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        gameEventEmitter.on(GameEventTypes.PlayerHasFinished, (data: GameEvents.PlayerHasFinished) => {
            eventData = data;
        });
        catchFoodGame.runForward('1', 500);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: '1',
            rank: catchFoodGame.playersState['1'].rank,
        });
    });

    //---------- Game has finished ----------

    it('should emit a GameHasFinished event when a all the players have finished race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        let gameFinishedEvent = false;
        gameEventEmitter.on(GameEventTypes.GameHasFinished, () => {
            gameFinishedEvent = true;
        });
        // finish game
        finishGame(catchFoodGame);
        expect(gameFinishedEvent).toBeTruthy();
    });

    it('should emit a GameHasFinished data when a all the players have finished race', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        let eventData: GameEvents.GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            trackLength: 0,
            numberOfObstacles: 0,
            playerRanks: [],
        };
        gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameEvents.GameHasFinished) => {
            eventData = data;
        });
        // finish game
        Date.now = jest.fn(() => dateNow + 10000);
        finishGame(catchFoodGame);

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            gameState: catchFoodGame.gameState,
            trackLength: catchFoodGame.trackLength,
            numberOfObstacles: catchFoodGame.numberOfObstacles,
        });

        const playerOneTotalTime = dateNow + 10000 - catchFoodGame.gameStartedTime;

        expect(eventData.playerRanks[0]).toMatchObject({
            id: '1',
            name: catchFoodGame.playersState['1'].name,
            rank: catchFoodGame.playersState['1'].rank,
            finished: true,
            totalTimeInMs: playerOneTotalTime,
            positionX: catchFoodGame.playersState['1'].positionX,
            isActive: true,
        });
    });

    //---------- Game has timed out ----------

    it('should emit a GameHasTimedOut event when the game has timed out', async () => {
        let gameTimedOutEvent = false;
        gameEventEmitter.on(GameEventTypes.GameHasTimedOut, () => {
            gameTimedOutEvent = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        jest.runAllTimers();
        expect(gameTimedOutEvent).toBeTruthy();
    });

    it('should emit correct GameHasFinished data when the game has timed out', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        let eventData: GameEvents.GameHasFinished = {
            roomId: '',
            gameState: GameState.Started,
            trackLength: 0,
            numberOfObstacles: 0,
            playerRanks: [],
        };

        gameEventEmitter.on(GameEventTypes.GameHasTimedOut, (data: GameEvents.GameHasFinished) => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);

        // player 1 has finished
        const player1FinishedTime = 500;
        Date.now = jest.fn(() => dateNow + player1FinishedTime);
        for (let i = 0; i < 4; i++) {
            catchFoodGame.playerHasCompletedObstacle('1', i);
        }
        catchFoodGame.runForward('1', catchFoodGame.trackLength);

        // player 2 has run forward - but should get the same rank as player 1
        catchFoodGame.runForward('2', 50);

        Date.now = jest.fn(() => dateNow + catchFoodGame.timeOutLimit);
        jest.advanceTimersByTime(catchFoodGame.timeOutLimit);

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            gameState: catchFoodGame.gameState,
            trackLength: catchFoodGame.trackLength,
            numberOfObstacles: catchFoodGame.numberOfObstacles,
        });

        // const playerOneTotalTime = dateNow + 10000 - catchFoodGame.gameStartedTime;
        const userId1 = '1';
        expect(eventData.playerRanks[0]).toMatchObject({
            id: userId1,
            name: catchFoodGame.playersState[userId1].name,
            rank: 1,
            finished: true,
            totalTimeInMs: player1FinishedTime,
            positionX: catchFoodGame.playersState[userId1].positionX,
            isActive: true,
        });

        const userId2 = '2';
        expect(eventData.playerRanks[1]).toMatchObject({
            id: userId2,
            name: catchFoodGame.playersState[userId2].name,
            rank: 2,
            finished: false,
            totalTimeInMs: catchFoodGame.timeOutLimit,
            positionX: catchFoodGame.playersState[userId2].positionX,
            isActive: true,
        });

        const userId3 = '3';
        expect(eventData.playerRanks[2]).toMatchObject({
            id: userId3,
            name: catchFoodGame.playersState[userId3].name,
            rank: 2,
            finished: false,
            totalTimeInMs: catchFoodGame.timeOutLimit,
            positionX: catchFoodGame.playersState[userId3].positionX,
            isActive: true,
        });
    });
});
