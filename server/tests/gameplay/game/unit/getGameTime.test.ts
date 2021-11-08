import { GameState } from '../../../../src/gameplay/enums';
import { dateNow, leaderboard, roomId, users } from '../../mockData';
import { MockGameClass } from '../../mockGameClass';

let game: MockGameClass;
const timePassed = 500;

describe('Rank failed user', () => {
    beforeEach(() => {
        Date.now = jest.fn(() => dateNow);
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
    });

    it('should return the game time since start when game state is started ', async () => {
        game.gameState = GameState.Started;
        game['_gameStartedAt'] = dateNow;
        Date.now = jest.fn(() => dateNow + timePassed);
        expect(game['gameTime']).toBe(timePassed);
    });

    it('should return the game time since start when game state is stopped ', async () => {
        game.gameState = GameState.Stopped;
        game['_gameStartedAt'] = dateNow;
        Date.now = jest.fn(() => dateNow + timePassed);
        expect(game['gameTime']).toBe(timePassed);
    });

    it('should return the game time since start when game state is finished ', async () => {
        game.gameState = GameState.Finished;
        game['_gameStartedAt'] = dateNow;
        Date.now = jest.fn(() => dateNow + timePassed);
        expect(game['gameTime']).toBe(timePassed);
    });

    it('should return the game time since start up to pause time when game state is paused ', async () => {
        game.gameState = GameState.Paused;
        game['_gameStartedAt'] = dateNow;
        game['_gamePausedAt'] = dateNow + timePassed;
        Date.now = jest.fn(() => dateNow + timePassed * 2);
        expect(game['gameTime']).toBe(timePassed);
    });

    it('should return 0 when game state is not started, paused, stopped or finished ', async () => {
        game.gameState = GameState.Created;
        expect(game['gameTime']).toBe(0);
    });
});
