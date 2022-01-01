import 'reflect-metadata';

import { GameState } from '../../../../src/gameplay/enums';
import { clearTimersAndIntervals } from '../../gameHelperFunctions';
import { leaderboard, roomId, users } from '../../mockData';
import { MockGameClass } from '../../mockGameClass';

let game: MockGameClass;

describe('Reconnect Player tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
        game.gameState = GameState.Started;
    });

    afterEach(async () => {
        clearTimersAndIntervals(game);
    });

    it('reconnectPlayer should set player isActive to true', async () => {
        game.disconnectPlayer('1');
        game.reconnectPlayer('1');
        expect(game.players.get('1')!.isActive).toBeTruthy();
    });

    it('reconnectPlayer should not change anything if player was not disconnected (no error should be thrown)', async () => {
        game.reconnectPlayer('1');
        expect(game.players.get('1')!.isActive).toBeTruthy();
    });

    it('cannot reconnect player when game has stopped', async () => {
        game.disconnectPlayer('1');
        game.stopGame();
        try {
            game.reconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(game.players.get('1')!.isActive).toBeFalsy();
    });

    it('cannot reconnect player when game has finished', async () => {
        game.disconnectPlayer('1');
        game.gameState = GameState.Finished;
        try {
            game.reconnectPlayer('1');
        } catch (e) {
            //ignore for this test
        }
        expect(game.players.get('1')!.isActive).toBeFalsy();
    });
});
