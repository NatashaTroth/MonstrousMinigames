import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../../mockData';
import { MockGameClass } from '../../mockGameClass';

// const TRACK_LENGTH = 500;

let game: MockGameClass;

describe('Disconnect Player tests', () => {
    beforeEach(() => {
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
    });

    it('cannot disconnect player when game has stopped', async () => {
        game.gameState = GameState.Stopped;
        try {
            game.disconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(game.players.get('1')?.isActive).toBeTruthy();
    });

    it('cannot disconnect player when game has finished', async () => {
        game.gameState = GameState.Finished;
        try {
            game.disconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(game.players.get('1')?.isActive).toBeTruthy();
    });

    it('should stop the game when all players have disconnected', async () => {
        game.gameState = GameState.Started;
        users.forEach(user => game.disconnectPlayer(user.id));
        expect(game.gameState).toBe(GameState.Stopped);
    });
});
