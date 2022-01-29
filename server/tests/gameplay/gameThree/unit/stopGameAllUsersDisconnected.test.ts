import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import GameThree from '../../../../src/gameplay/gameThree/GameThree';
import { leaderboard, roomId } from '../../mockData';

let gameThree: GameThree;

describe('Stop game all users disconnected', () => {
    beforeEach(() => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.gameState = GameState.Started;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call stopGameAllUsersDisconnected super function', async () => {
        const spy = jest.spyOn(gameThree, 'stopGameAllUsersDisconnected').mockImplementation(() => {
            Promise.resolve();
        });

        gameThree['stopGameAllUsersDisconnected']();
        expect(spy).toHaveBeenCalledTimes(1);
    });
});
