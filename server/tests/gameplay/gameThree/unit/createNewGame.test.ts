import 'reflect-metadata';

import Game from '../../../../src/gameplay/Game';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;

describe('Get game state info ', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('call super function', async () => {
        const spy = jest.spyOn(Game.prototype as any, 'createNewGame').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree.createNewGame(users);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it.todo('creates photo topics');
    // it.skip('creates photo topics', async () => {
    // gameThree.createNewGame(users);
    // expect(gameThree.photoTopics.topics!.length).toBe(InitialParameters.NUMBER_ROUNDS - 1);
    // });
});
