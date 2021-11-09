import 'reflect-metadata';
import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { GameTwo } from '../../../src/gameplay';
import { GlobalEventMessage, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED } from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId, users } from '../mockData';


let gameTwo: GameTwo;
let gameEventEmitter: GameEventEmitter;

const beforeEachFunction = () => {
    gameTwo = new GameTwo(roomId, leaderboard);
    jest.useFakeTimers();
};


describe('Event Emitter', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });

    beforeEach(() => {
        beforeEachFunction();
    });


    it('should create a new GameTwoEventEmitter instance (same object)', async () => {
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


    it('should emit a GameHasStarted event when the game is started', async () => {
        let gameStartedEvent = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED) {
                gameStartedEvent = true;
            }
        });
        expect(gameStartedEvent).toBeFalsy();

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);

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

        gameTwo.createNewGame(users);
        gameTwo.startGame();
        jest.advanceTimersByTime(gameTwo.countdownTime);

        gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
        expect(eventData).toMatchObject({
            roomId: gameTwo.roomId,
            countdownTime: gameTwo.countdownTime,
        });
    });

    describe('Game has paused events', () => {
        beforeAll(() => {
            gameEventEmitter = DI.resolve(GameEventEmitter);
        });

        beforeEach(() => {
            beforeEachFunction();
        });


        it('should emit a GameHasPaused event when the game has been paused', async () => {
            let gameHasPaused = false;
            gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
                if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED) {
                    gameHasPaused = true;
                }
            });

            gameTwo.createNewGame(users);
            gameTwo.startGame();
            jest.advanceTimersByTime(gameTwo.countdownTime);

            gameTwo.pauseGame();
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
            gameTwo.createNewGame(users);
            gameTwo.startGame();
            jest.advanceTimersByTime(gameTwo.countdownTime);

            gameTwo.pauseGame();

            gameEventEmitter.removeAllListeners(GameEventEmitter.EVENT_MESSAGE_EVENT);
            expect(eventData).toMatchObject({
                roomId: gameTwo.roomId,
            });
        });
    });
});

