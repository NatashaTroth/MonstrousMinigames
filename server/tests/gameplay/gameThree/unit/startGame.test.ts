import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import Game from '../../../../src/gameplay/Game';
import InitialParameters from '../../../../src/gameplay/gameThree/constants/InitialParameters';
import { GameThreeGameState } from '../../../../src/gameplay/gameThree/enums/GameState';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Start', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        jest.useFakeTimers();
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
    });
    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should call start super function', async () => {
        const spy = jest.spyOn(Game.prototype as any, 'startGame').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['startGame']();
        jest.advanceTimersByTime(InitialParameters.COUNTDOWN_TIME_GAME_START);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a GameHasStarted event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED) {
                eventCalled = true;
            }
        });
        gameThree['startGame']();
        expect(eventCalled).toBeTruthy();
    });

    it('should start TakingPhoto stage', async () => {
        gameThree['photoTopics'] = ['topic1', 'topic2'];
        gameThree['startGame']();
        expect(gameThree['gameThreeGameState']).toBe(GameThreeGameState.TakingPhoto);
    });
});
