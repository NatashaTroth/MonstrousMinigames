import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { leaderboard, roomId } from '../../mockData';

let gameOne: GameOne;

describe('Change and verify game state', () => {
    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
    });

    it('sets state to finished when new game is finished', async () => {
        gameOne['handleGameFinished']();
    });
});
