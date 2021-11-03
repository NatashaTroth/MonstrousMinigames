import 'reflect-metadata';

import { GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import { MockGameClass } from '../mockGameClass';

let game: MockGameClass;
const dateNow = 2;

describe('Pause tests', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        Date.now = jest.fn(() => dateNow);
        game = new MockGameClass(roomId, leaderboard);
        game.createNewGame(users);
        game.gameState = GameState.Started;
    });

    it('sets pause time to now', async () => {
        Date.now = jest.fn(() => dateNow + 5000);
        game.pauseGame();
        expect(game['_gamePausedAt']).toBe(dateNow + 5000);
    });
});

describe('Resume tests', () => {
    beforeEach(() => {
        // global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime())
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

    it('updates gameStartedTime correctly to accommodate pause', async () => {
        const gameStartTime = Date.now();
        const gamePauseTime = gameStartTime + 5000;
        const gameResumeTime = gameStartTime + 15000;
        const gameTimePassed = gamePauseTime - gameStartTime;
        const newGameStartedTime = gameResumeTime - gameTimePassed;

        game.startGame();
        Date.now = jest.fn(() => gamePauseTime);
        game.pauseGame();
        expect(game['_gamePausedAt']).toBe(gamePauseTime);
        Date.now = jest.fn(() => gameResumeTime);
        game.resumeGame();

        expect(game['_gameStartedAt']).toBe(newGameStartedTime);
    });
});
