import 'reflect-metadata';

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
        const spy = jest.spyOn(gameThree, 'createNewGame').mockImplementation(() => {
            Promise.resolve();
        });
        gameThree.createNewGame(users);
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
