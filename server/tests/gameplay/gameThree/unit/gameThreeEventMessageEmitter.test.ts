import 'reflect-metadata';

import DI from '../../../../src/di';
import { GameThree } from '../../../../src/gameplay';
import {
    GameThreeEventMessageEmitter
} from '../../../../src/gameplay/gameThree/GameThreeEventMessageEmitter';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC
} from '../../../../src/gameplay/gameThree/interfaces/GameThreeEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;
// let gameEventEmitter: GameEventEmitter;
let gameThreeEventMessageEmitter: GameThreeEventMessageEmitter;

describe('Can handle function', () => {
    beforeAll(() => {
        // gameEventEmitter = DI.resolve(GameEventEmitter);
        gameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);
        // gameThreeEventMessageEmitter = new GameThreeEventMessageEmitter(gameEventEmitter);
    });

    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    it('should return false for a wrong message type', async () => {
        expect(gameThreeEventMessageEmitter.canHandle({ type: 'test', roomId: 'xx' }, gameThree)).toBeFalsy();
    });

    it('should return true for a correct message type', async () => {
        expect(
            gameThreeEventMessageEmitter.canHandle(
                { type: GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, roomId: 'xx' },
                gameThree
            )
        ).toBeTruthy();
    });
});

describe('Handle function', () => {
    beforeAll(() => {
        // gameEventEmitter = DI.resolve(GameEventEmitter);
        gameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);
    });

    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });

    it.todo('handle events');
});
