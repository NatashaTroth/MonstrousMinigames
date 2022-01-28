import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { ObstacleType } from '../../../../src/gameplay/gameOne/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { GameEvents } from '../../../../src/gameplay/gameOne/interfaces';
import {
    GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED, GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED,
    GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
    GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED, GameOneEventMessage
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId, users } from '../../mockData';
import {
    clearTimersAndIntervals, finishGame, finishPlayer, goToNextUnsolvableObstacle,
    startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';

let gameOne: GameOne;
let gameEventEmitter: GameEventEmitter;
const InitialParameters = getInitialParams();

const beforeEachFunction = () => {
    gameOne = new GameOne(roomId, leaderboard);
    jest.useFakeTimers();
};

const afterEachFunction = () => {
    clearTimersAndIntervals(gameOne);
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

    it('should create a new GameOneEventEmitter instance (same object)', async () => {
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
        startGameAndAdvanceCountdown(gameOne);
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

        startGameAndAdvanceCountdown(gameOne);

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
            countdownTime: gameOne.countdownTime,
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
        startGameAndAdvanceCountdown(gameOne);

        let obstacleEventReceived = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED) {
                obstacleEventReceived = true;
            }
        });

        goToNextUnsolvableObstacle(gameOne, '1');
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
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__OBSTACLE_REACHED) {
                eventData = message as any;
            }
        });

        startGameAndAdvanceCountdown(gameOne);
        goToNextUnsolvableObstacle(gameOne, '1');

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
            userId: '1',
            obstacleId: gameOne.players.get('1')!.obstacles[0].id,
            obstacleType: gameOne.players.get('1')!.obstacles[0].type,
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.pauseGame();
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.pauseGame();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.pauseGame();
        gameOne.resumeGame();
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.pauseGame();
        gameOne.resumeGame();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.stopGameUserClosed();
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.stopGameUserClosed();
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: 'xxx',
            userId: '1',
        });
    });

    it('should not emit a PlayerHasDisconnected event when an inactive player is disconnected', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        let playerHasDisconnectedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED) {
                playerHasDisconnectedEvent = true;
            }
        });
        gameOne.disconnectPlayer('1');
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('1');
        gameOne.reconnectPlayer('1');
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
        startGameAndAdvanceCountdown(gameOne);
        gameOne.reconnectPlayer('1');
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
        startGameAndAdvanceCountdown(gameOne);

        let playerFinished = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED) {
                playerFinished = true;
            }
        });
        finishPlayer(gameOne, '1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(playerFinished).toBeTruthy();
    });

    it('should emit a PlayerHasFinished data when a player has reached the end of the race', async () => {
        startGameAndAdvanceCountdown(gameOne);

        let eventData = {
            roomId: '',
            userId: '',
            rank: 0,
        };
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_FINISHED) {
                eventData = message as any;
            }
        });
        finishPlayer(gameOne, '1');
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
            userId: '1',
            rank: gameOne.players.get('1')?.rank,
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
        startGameAndAdvanceCountdown(gameOne);
        let gameFinishedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
                gameFinishedEvent = true;
            }
        });
        // finish game
        finishGame(gameOne);
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(gameFinishedEvent).toBeTruthy();
    });

    it('should emit a GameHasFinished data when a all the players have finished race', async () => {
        const dateNow = 1618665766156;
        Date.now = jest.fn(() => dateNow);
        startGameAndAdvanceCountdown(gameOne);
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
        finishGame(gameOne);

        expect(eventData).toMatchObject({
            roomId: gameOne.roomId,
            gameState: gameOne.gameState,
        });

        const playerOneTotalTime = dateNow + 10000 - gameOne['gameStartedAt'];

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData.playerRanks[0]).toMatchObject({
            id: '1',
            name: gameOne.players.get('1')?.name,
            rank: gameOne.players.get('1')?.rank,
            finished: true,
            totalTimeInMs: playerOneTotalTime,
            positionX: gameOne.players.get('1')?.positionX,
            isActive: true,
        });
    });
});

describe('Chaser event', () => {
    const dateNow = 1618665766156;

    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
        Date.now = jest.fn(() => dateNow);
        gameOne.chasersPositionX = 50;
        startGameAndAdvanceCountdown(gameOne);
    });

    afterEach(() => {
        afterEachFunction();
    });

    it('should emit a ChasersWerePushed event when chasers are pushed', async () => {
        let chasersEvent = false;

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__CHASERS_WERE_PUSHED) {
                chasersEvent = true;
            }
        });
        // gameOne['runForward']('1', chasersStartPosX);
        gameOne.players.get(users[0].id)!.finished = true;
        gameOne['pushChasers'](users[0].id);
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(chasersEvent).toBeTruthy();
    });

    it('should emit a PlayerHasExceededMaxNumberChaserPushes event when a player has exceeded their max number of chaser pushes', async () => {
        let maxNrChasersEvent = false;

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
            if (message.type === GAME_ONE_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES) {
                maxNrChasersEvent = true;
            }
        });
        // gameOne['runForward']('1', chasersStartPosX);
        gameOne.players.get(users[0].id)!.finished = true;
        gameOne.players.get(users[0].id)!.chaserPushesUsed = InitialParameters.MAX_NUMBER_CHASER_PUSHES - 1;
        gameOne['pushChasers'](users[0].id);
        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(maxNrChasersEvent).toBeTruthy();
    });

    // it.skip('should emit a PlayerIsDead event when a chaser catches a player', async () => {
    //     let playerIsDeadEvent = false;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameOneEventMessage) => {
    //         if (message.type === GAME_ONE_EVENT_MESSAGE__PLAYER_IS_DEAD) {
    //             playerIsDeadEvent = true;
    //         }
    //     });
    //     // gameOne['runForward']('1', chasersStartPosX);
    //     jest.advanceTimersByTime(1000);
    //     gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
    //     expect(playerIsDeadEvent).toBeTruthy();
    // });

    // TODO:
    // it('emit game finished event when all but one player caught', async () => {
    //     let eventData = false;
    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
    //         if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
    //             eventData = true;
    //         }
    //     });

    //     users.forEach(user => {
    //         gameOne.players.get(user.id)!.positionX = 0;
    //     });

    //     gameOne['updateChasersPosition'](100);

    //     expect(eventData).toBeTruthy();
    // });
});
