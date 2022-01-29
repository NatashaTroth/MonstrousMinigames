import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GlobalEventMessage
} from '../../../../src/gameplay/interfaces/GlobalEventMessages';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Stop game user closed', () => {
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

    it('should call stopGameUserClosed super function', async () => {
        const spy = jest.spyOn(gameThree, 'stopGameUserClosed').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree.stopGameUserClosed();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit a gameHasStoppedEvent event', async () => {
        let eventCalled = false;
        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
            if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED) {
                eventCalled = true;
            }
        });
        gameThree.stopGameUserClosed();
        expect(eventCalled).toBeTruthy();
    });
});
