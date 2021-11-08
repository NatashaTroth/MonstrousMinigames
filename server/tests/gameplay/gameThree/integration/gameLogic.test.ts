import 'reflect-metadata';

import GameEventEmitter from '../../../../src/classes/GameEventEmitter';
import DI from '../../../../src/di';
import { GameState } from '../../../../src/gameplay/enums';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GameThreeEventMessage
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;
let gameEventEmitter: GameEventEmitter;

describe('Game run through', () => {
    beforeAll(() => {
        gameEventEmitter = DI.resolve(GameEventEmitter);
    });
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runAllTimers();
        jest.clearAllMocks();
    });

    it('should send a photo topic for the first round', async () => {
        let eventCalled = false;

        gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
            if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC) {
                eventCalled = true;
            }
        });
        gameThree.gameState = GameState.Started;
        gameThree.startGame();
        jest.advanceTimersByTime(gameThree['countdownTimeGameStart']);
        expect(eventCalled).toBeTruthy();
    });

    it.todo('run through gameplay after unit tests');
    // it('should change to next round when first round is complete', async () => {
    //     let eventCalled = false;

    //     gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GameThreeEventMessage) => {
    //         if (message.type === GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC) {
    //             eventCalled = true;
    //         }
    //     });
    //     gameThree.gameState = GameState.Started;
    //     gameThree.startGame();
    //     jest.advanceTimersByTime(gameThree['countdownTimeGameStart']);
    //     expect(eventCalled).toBeTruthy();
    // });
});
