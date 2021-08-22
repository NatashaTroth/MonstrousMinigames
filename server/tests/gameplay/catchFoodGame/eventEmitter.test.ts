// import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { ObstacleType } from '../../../src/gameplay/catchFood/enums';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces/';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import {
    advanceCountdown, clearTimersAndIntervals, finishGame, finishPlayer, releaseThreadN,
    skipTimeToStartChasers, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: CatchFoodGameEventEmitter;

const beforeEachFunction = () => {
    catchFoodGame = new CatchFoodGame(roomId, leaderboard);
    jest.useFakeTimers();
};

const afterEachFunction = () => {
    clearTimersAndIntervals(catchFoodGame);
};

describe('Event Emitter', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should create a new CatchFoodGameEventEmitter instance (same object)', async () => {
        const gameEventEmitterNew = CatchFoodGameEventEmitter.getInstance();
        expect(gameEventEmitterNew).toBe(gameEventEmitter);
    });
});

describe('Start Game events ', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

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
});

describe('Obstacle reached events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit an ObstacleReached event when an obstacle is reached', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        let obstacleEventReceived = false;
        gameEventEmitter.on(GameEventTypes.ObstacleReached, () => {
            obstacleEventReceived = true;
        });

        const distanceToObstacle =
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle);
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
            catchFoodGame.players.get('1')!.obstacles[0].positionX - catchFoodGame.players.get('1')!.positionX;
        catchFoodGame['runForward']('1', distanceToObstacle);

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: '1',
            obstacleId: catchFoodGame.players.get('1')!.obstacles[0].id,
            obstacleType: catchFoodGame.players.get('1')!.obstacles[0].type,
        });
    });
});

describe('Game has paused events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

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
});

describe('Game has resumed events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

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
});

describe('Game has stopped events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a GameHasStopped event when the game has been stopped by the user', async () => {
        let gameHasStopped = false;
        gameEventEmitter.on(GameEventTypes.GameHasStopped, () => {
            gameHasStopped = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGameUserClosed();
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
        catchFoodGame.stopGameUserClosed();
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });
});

describe('Player has disconnected events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

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

    it('should not emit a PlayerHasDisconnected event when an inactive player is disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        let playerHasDisconnectedEvent = false;
        gameEventEmitter.on(GameEventTypes.PlayerHasDisconnected, () => {
            playerHasDisconnectedEvent = true;
        });
        catchFoodGame.disconnectPlayer('1');
        expect(playerHasDisconnectedEvent).toBeFalsy();
    });

    it('should emit a AllPlayersHaveDisconnected event when all players have disconnected', async () => {
        let allPlayersHaveDisconnected = false;
        gameEventEmitter.on(GameEventTypes.AllPlayersHaveDisconnected, () => {
            allPlayersHaveDisconnected = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        users.forEach(user => catchFoodGame.disconnectPlayer(user.id));
        expect(allPlayersHaveDisconnected).toBeTruthy();
    });
});

describe('Player has reconnected events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a PlayerHasReconnected event when a player is reconnected', async () => {
        let playerHasReconnectedEvent = false;
        gameEventEmitter.on(GameEventTypes.PlayerHasReconnected, () => {
            playerHasReconnectedEvent = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        expect(playerHasReconnectedEvent).toBeTruthy();
    });

    it('should emit a roomId and userId when a player is reconnected', async () => {
        let eventData: GameEvents.PlayerHasReconnectedInfo = {
            roomId: '',
            userId: '',
        };
        gameEventEmitter.on(GameEventTypes.PlayerHasReconnected, data => {
            eventData = data;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        expect(eventData).toMatchObject({
            roomId: 'xxx',
            userId: '1',
        });
    });

    it('should not emit a PlayerHasReconnected event when an active player is reconnected', async () => {
        let playerHasReconnectedEvent = false;
        gameEventEmitter.on(GameEventTypes.PlayerHasReconnected, () => {
            playerHasReconnectedEvent = true;
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.reconnectPlayer('1');
        expect(playerHasReconnectedEvent).toBeFalsy();
    });
});

describe('Player has finished events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a PlayerHasFinished event when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        let playerFinished = false;
        gameEventEmitter.on(GameEventTypes.PlayerHasFinished, () => {
            playerFinished = true;
        });
        finishPlayer(catchFoodGame, '1');
        expect(playerFinished).toBeTruthy();
    });

    it('should emit a PlayerHasFinished data when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        let eventData: GameEvents.PlayerHasFinished = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        gameEventEmitter.on(GameEventTypes.PlayerHasFinished, (data: GameEvents.PlayerHasFinished) => {
            eventData = data;
        });
        finishPlayer(catchFoodGame, '1');
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: '1',
            rank: catchFoodGame.players.get('1')?.rank,
        });
    });
});

describe('Game has finished events', () => {
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

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

        const playerOneTotalTime = dateNow + 10000 - catchFoodGame['gameStartedAt'];

        expect(eventData.playerRanks[0]).toMatchObject({
            id: '1',
            name: catchFoodGame.players.get('1')?.name,
            rank: catchFoodGame.players.get('1')?.rank,
            finished: true,
            totalTimeInMs: playerOneTotalTime,
            positionX: catchFoodGame.players.get('1')?.positionX,
            isActive: true,
        });
    });
});

describe('Chaser event', () => {
    const dateNow = 1618665766156;
    let chasersStartPosX = 0;
    beforeAll(() => {
        gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
    });

    beforeEach(() => {
        beforeEachFunction();
        Date.now = jest.fn(() => dateNow);
        catchFoodGame.chasersPositionX = 50;
        startGameAndAdvanceCountdown(catchFoodGame);
        chasersStartPosX = catchFoodGame.chasersPositionX;
    });

    afterEach(() => {
        afterEachFunction();
    });

    it.skip('should emit a PlayerIsDead event when a chaser catches a player', async () => {
        let playerIsDeadEvent = false;
        gameEventEmitter.on(GameEventTypes.PlayerIsDead, () => {
            playerIsDeadEvent = true;
        });
        skipTimeToStartChasers(catchFoodGame);
        // catchFoodGame['runForward']('1', chasersStartPosX);
        jest.advanceTimersByTime(1000);
        expect(playerIsDeadEvent).toBeTruthy();
    });

    it.skip('should emit a PlayerIsDead data when a chaser catches a player', async () => {
        let eventData: GameEvents.PlayerIsDead = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        const userId = '1';
        gameEventEmitter.on(GameEventTypes.PlayerIsDead, data => {
            eventData = data;
        });

        catchFoodGame['runForward'](userId, chasersStartPosX + 20);
        catchFoodGame.players.get('2')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('3')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('4')!.positionX = chasersStartPosX + 2000;

        // should catch the other three players
        skipTimeToStartChasers(catchFoodGame);
        jest.advanceTimersByTime(2000); //move 1 every 100ms -> 2000/100 = 20. move 20 to get to player

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: userId,
            rank: 4,
        });
    });
});
