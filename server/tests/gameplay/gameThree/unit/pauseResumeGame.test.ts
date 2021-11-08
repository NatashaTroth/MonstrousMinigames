import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import Game from '../../../../src/gameplay/Game';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED, GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
    GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Pause', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call pause super function', async () => {
        const spy = jest.spyOn(Game.prototype as any, 'pauseGame').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['pauseGame']();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a GameHasPaused event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED) {
                eventCalled = true;
            }
        });
        gameThree['pauseGame']();
        expect(eventCalled).toBeTruthy();
    });
});

describe('Resume', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call resume super function', async () => {
        const spy = jest.spyOn(Game.prototype as any, 'resumeGame').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['resumeGame']();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a GameHasResumed event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED) {
                eventCalled = true;
            }
        });
        gameThree['resumeGame']();
        expect(eventCalled).toBeTruthy();
    });
});
