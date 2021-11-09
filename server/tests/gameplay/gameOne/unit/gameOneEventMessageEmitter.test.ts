import 'reflect-metadata';

import DI from '../../../../src/di';
import { GameOne } from '../../../../src/gameplay';
import {
    GameOneEventMessageEmitter
} from '../../../../src/gameplay/gameOne/GameOneEventMessageEmitter';
import {
    GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE
} from '../../../../src/gameplay/gameOne/interfaces/GameOneEventMessages';
import { leaderboard, roomId, users } from '../../mockData';

let gameOne: GameOne;
// let gameEventEmitter: GameEventEmitter;
let gameOneEventMessageEmitter: GameOneEventMessageEmitter;

describe('Can handle function', () => {
    beforeAll(() => {
        // gameEventEmitter = DI.resolve(GameEventEmitter);
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
        // gameOneEventMessageEmitter = new GameOneEventMessageEmitter(gameEventEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    it('should return false for a wrong message type', async () => {
        expect(gameOneEventMessageEmitter.canHandle({ type: 'test', roomId: 'xx' }, gameOne)).toBeFalsy();
    });

    it('should return true for a correct message type', async () => {
        expect(
            gameOneEventMessageEmitter.canHandle(
                { type: GAME_ONE_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE, roomId: 'xx' },
                gameOne
            )
        ).toBeTruthy();
    });
});

describe('Handle function', () => {
    beforeAll(() => {
        // gameEventEmitter = DI.resolve(GameEventEmitter);
        gameOneEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);
    });

    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        gameOne.createNewGame(users);
    });

    it.todo('handle events');
});
