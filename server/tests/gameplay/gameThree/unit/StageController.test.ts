import 'reflect-metadata';

import { GameThree } from '../../../../src/gameplay';
import { leaderboard, roomId, users } from '../../mockData';

let gameThree: GameThree;

describe('Initiate Game', () => {
    beforeEach(async () => {
        gameThree = new GameThree(roomId, leaderboard);
        gameThree.createNewGame(users);
    });
    it.todo('test StageController');

    // it('initiates gameThreeGameState with BeforeStart value', async () => {
    //     expect(gameThree['stageController']!.stage).toBe(GameThreeGameState.BeforeStart);
    // });
});
