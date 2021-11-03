import 'reflect-metadata';

import { GameState } from '../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../mockData';
import { MockGameClass } from '../mockGameClass';

let game: MockGameClass;

describe('Verify game state', () => {
    beforeEach(async () => {
        game = new MockGameClass(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('initialises state as initialised', async () => {
        expect(game.gameState).toBe(GameState.Initialised);
    });

    it('sets state to created when new game is created', async () => {
        game.createNewGame(users);
        expect(game.gameState).toBe(GameState.Created);
    });

    it('sets state to started when new game is started ', async () => {
        game.createNewGame(users);
        game.startGame();
        expect(game.gameState).toBe(GameState.Started);
    });

    it('sets state to paused when new game is paused ', async () => {
        game.createNewGame(users);
        game.gameState = GameState.Started;
        game.pauseGame();
        expect(game.gameState).toBe(GameState.Paused);
    });

    it('sets state to started when new game is resumed ', async () => {
        game.createNewGame(users);
        game.gameState = GameState.Paused;
        game.resumeGame();
        expect(game.gameState).toBe(GameState.Started);
    });

    it('should have a GameState of Stopped when the game is stopped', async () => {
        game.gameState = GameState.Started;
        game.stopGame();
        expect(game.gameState).toBe(GameState.Stopped);
    });
});

describe('Verify when game state can change', () => {
    beforeEach(async () => {
        game = new MockGameClass(roomId, leaderboard);
        jest.useFakeTimers();
    });
    it("shouldn't be able to stop game unless game has started", async () => {
        try {
            game.stopGame();
        } catch (e) {
            //ignore for this test
        }
        expect(game.gameState).toBe(GameState.Initialised);
    });

    it('should be able to stop game when started', async () => {
        game.gameState = GameState.Started;
        game.stopGameUserClosed();
        expect(game.gameState).toBe(GameState.Stopped);
    });

    it('should be able to stop game when paused', async () => {
        game.gameState = GameState.Paused;
        game.stopGameUserClosed();
        expect(game.gameState).toBe(GameState.Stopped);
    });
});
