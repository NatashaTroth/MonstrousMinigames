import 'reflect-metadata';

import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { CatchFoodGame } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import { ObstacleType } from '../../../src/gameplay/gameOne/enums';
import { GameEvents } from '../../../src/gameplay/gameOne/interfaces';
import {
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD, CatchFoodGameEventMessage
} from '../../../src/gameplay/gameOne/interfaces/CatchFoodGameEventMessages';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED, GlobalEventMessage
} from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../mockData';
import {
    clearTimersAndIntervals, finishGame, finishPlayer, goToNextUnsolvableObstacle,
    startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;
let gameEventEmitter: GameEventEmitter;

const beforeEachFunction = () => {
    catchFoodGame = new CatchFoodGame(roomId, leaderboard);
    jest.useFakeTimers();
};

const afterEachFunction = () => {
    clearTimersAndIntervals(catchFoodGame);
};

describe('Event Emitter', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should create a new CatchFoodGameEventEmitter instance (same object)', async () => {
        const gameEventEmitterNew = DI.resolve(GameEventEmitter);
        expect(gameEventEmitterNew).toBe(gameEventEmitter);
    });
});

describe('Start Game events ', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
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
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED) {
                gameStartedEvent = true;
            }
        });
        expect(gameStartedEvent).toBeFalsy();
        startGameAndAdvanceCountdown(catchFoodGame);
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(gameStartedEvent).toBeTruthy();
    });

    it('should emit GameHasStarted data when the game is started', async () => {
        let eventData = {
            roomId: '',
            countdownTime: 0,
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED) {
                eventData = message as any;
            }
        });

        startGameAndAdvanceCountdown(catchFoodGame);

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            countdownTime: catchFoodGame.countdownTime,
        });
    });
});

describe('Obstacle reached events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
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
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED) {
                obstacleEventReceived = true;
            }
        });

        goToNextUnsolvableObstacle(catchFoodGame, '1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(obstacleEventReceived).toBeTruthy();
    });

    it('should emit an ObstacleReachedInfo data when an obstacle is reached', async () => {
        let eventData: GameEvents.ObstacleReachedInfo = {
            roomId: '',
            userId: '',
            obstacleId: 1,
            obstacleType: ObstacleType.TreeStump, //null not possible
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED) {
                eventData = message as any;
            }
        });

        startGameAndAdvanceCountdown(catchFoodGame);
        goToNextUnsolvableObstacle(catchFoodGame, '1');

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
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
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a GameHasPaused event when the game has been paused', async () => {
        let gameHasPaused = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED) {
                gameHasPaused = true;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(gameHasPaused).toBeTruthy();
    });

    it('should emit GameStateHasChanged data when the game has been paused', async () => {
        let eventData = {
            roomId: '',
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED) {
                eventData = message as any;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });
});

describe('Game has resumed events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a GameHasResumed event when the game has been paused', async () => {
        let gameHasResumed = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED) {
                gameHasResumed = true;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.resumeGame();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(gameHasResumed).toBeTruthy();
    });

    it('should emit GameStateHasChanged data when the game has resumed', async () => {
        let eventData = {
            roomId: '',
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED) {
                eventData = message as any;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.resumeGame();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });
});

describe('Game has stopped events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a GameHasStopped event when the game has been stopped by the user', async () => {
        let gameHasStopped = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED) {
                gameHasStopped = true;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGameUserClosed();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(gameHasStopped).toBeTruthy();
    });

    it('should emit GameStateHasChanged data when the game has stopped', async () => {
        let eventData = {
            roomId: '',
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED) {
                eventData = message as any;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGameUserClosed();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
        });
    });
});

describe('Player has disconnected events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a PlayerHasDisconnected event when a player is disconnected', async () => {
        let playerHasDisconnectedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED) {
                playerHasDisconnectedEvent = true;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerHasDisconnectedEvent).toBeTruthy();
    });

    it('should emit a roomId and userId when a player is disconnected', async () => {
        let eventData = {
            roomId: '',
            userId: '',
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED) {
                eventData = message as any;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: 'xxx',
            userId: '1',
        });
    });

    it('should not emit a PlayerHasDisconnected event when an inactive player is disconnected', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        let playerHasDisconnectedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED) {
                playerHasDisconnectedEvent = true;
            }
        });
        catchFoodGame.disconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerHasDisconnectedEvent).toBeFalsy();
    });
});

describe('Player has reconnected events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a PlayerHasReconnected event when a player is reconnected', async () => {
        let playerHasReconnectedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED) {
                playerHasReconnectedEvent = true;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerHasReconnectedEvent).toBeTruthy();
    });

    it('should emit a roomId and userId when a player is reconnected', async () => {
        let eventData = {
            roomId: '',
            userId: '',
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED) {
                eventData = message as any;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('1');
        catchFoodGame.reconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: 'xxx',
            userId: '1',
        });
    });

    it('should not emit a PlayerHasReconnected event when an active player is reconnected', async () => {
        let playerHasReconnectedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED) {
                playerHasReconnectedEvent = true;
            }
        });
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.reconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerHasReconnectedEvent).toBeFalsy();
    });
});

describe('Player has finished events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
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
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED) {
                playerFinished = true;
            }
        });
        finishPlayer(catchFoodGame, '1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerFinished).toBeTruthy();
    });

    it('should emit a PlayerHasFinished data when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        let eventData = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED) {
                eventData = message as any;
            }
        });
        finishPlayer(catchFoodGame, '1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: '1',
            rank: catchFoodGame.players.get('1')?.rank,
        });
    });
});

describe('Game has finished events', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
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
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                gameFinishedEvent = true;
            }
        });
        // finish game
        finishGame(catchFoodGame);
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(gameFinishedEvent).toBeTruthy();
    });

    it('should emit a GameHasFinished data when a all the players have finished race', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(catchFoodGame);
        let eventData = {
            roomId: '',
            gameState: GameState.Started,
            playerRanks: [],
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                eventData = message.data as any;
            }
        });
        // finish game
        Date.now = jest.fn(() => dateNow + 10000);
        finishGame(catchFoodGame);

        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            gameState: catchFoodGame.gameState,
        });

        const playerOneTotalTime = dateNow + 10000 - catchFoodGame['gameStartedAt'];

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
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
        gameEventEmitter = DI.resolve(GameEventEmitter);
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
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD) {
                playerIsDeadEvent = true;
            }
        });
        // catchFoodGame['runForward']('1', chasersStartPosX);
        jest.advanceTimersByTime(1000);
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerIsDeadEvent).toBeTruthy();
    });

    it.skip('should emit a PlayerIsDead data when a chaser catches a player', async () => {
        let eventData = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        const userId = '1';
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: CatchFoodGameEventMessage) => {
            if (message.type === CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD) {
                eventData = message as any;
            }
        });

        catchFoodGame['runForward'](userId, chasersStartPosX + 20);
        catchFoodGame.players.get('2')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('3')!.positionX = chasersStartPosX + 2000;
        catchFoodGame.players.get('4')!.positionX = chasersStartPosX + 2000;

        // should catch the other three players
        jest.advanceTimersByTime(2000); //move 1 every 100ms -> 2000/100 = 20. move 20 to get to player

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: catchFoodGame.roomId,
            userId: userId,
            rank: 4,
        });
    });
});
