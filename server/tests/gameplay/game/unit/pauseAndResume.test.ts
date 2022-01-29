import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../../mockData';
import { MockGameClass } from '../../mockGameClass';

let game: MockGameClass;
const dateNow = 2;

describe('Resume tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        Date.now = jest.fn(() => dateNow);
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
        game.gameState = GameState.Started;
    });

    it('Can resume game when game has been paused', async () => {
        game.pauseGame();
        game.resumeGame();
        expect(game.gameState).toBe(GameState.Started);
    });
});
