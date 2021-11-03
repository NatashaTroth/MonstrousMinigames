import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { verifyGameState } from '../../../../src/gameplay/helperFunctions/verifyGameState';
import { leaderboard, roomId, users } from '../../mockData';
import {
    clearTimersAndIntervals, completeNextObstacle, finishGame, finishPlayer,
    startGameAndAdvanceCountdown
} from './gameOneHelperFunctions';

let gameOne: GameOne;

describe('Change and verify game state', () => {
    beforeEach(async () => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it("shouldn't be able to move player until game has started", async () => {
        expect(() => verifyGameState(gameOne.gameState, [GameState.Started])).toThrow();
    });

    it("shouldn't be able to move player until game has started and the countdown has run", async () => {
        gameOne.createNewGame(users, 1550, 4);
        const initialPositionX = gameOne.players.get('1')!.positionX;
        try {
            gameOne['runForward']('50');
        } catch (e) {
            //ignore for this test
        }
        expect(gameOne.players.get('1')!.positionX).toBe(initialPositionX);
    });

    it('should be able to move player once game has started and the countdown has run', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const initialPositionX = gameOne.players.get('1')!.positionX;
        gameOne['runForward']('1', 10);
        expect(gameOne.players.get('1')!.positionX).toBe(initialPositionX + 10);
    });

    it("shouldn't be able to move player when game is paused", async () => {
        startGameAndAdvanceCountdown(gameOne);
        const initialPositionX = gameOne.players.get('1')!.positionX;
        gameOne.pauseGame();
        try {
            gameOne['runForward']('50');
        } catch (e) {
            //ignore in this test
        }

        expect(gameOne.players.get('1')!.positionX).toBe(initialPositionX);
    });

    it("shouldn't be able to complete obstacle until game has started", async () => {
        gameOne.createNewGame(users, 1550, 4);
        // Countdown still has to run
        const obstaclesCompletedLength = gameOne.players.get('1')!.obstacles.length;
        try {
            gameOne['playerHasCompletedObstacle']('1', 0);
        } catch (e) {
            //ignore for this test
        }
        expect(gameOne.players.get('1')!.obstacles.length).toBe(obstaclesCompletedLength);
    });

    it('should be able to complete obstacle when game has started', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const obstaclesCompletedLength = gameOne.players.get('1')!.obstacles.length;
        completeNextObstacle(gameOne, '1');
        expect(gameOne.players.get('1')!.obstacles.length).toBe(obstaclesCompletedLength - 1);
    });

    it("shouldn't be able to complete obstacle when game is paused", async () => {
        startGameAndAdvanceCountdown(gameOne);
        const obstaclesCompletedLength = gameOne.players.get('1')!.obstacles.length;
        gameOne.pauseGame();
        try {
            gameOne['playerHasCompletedObstacle']('1', 0);
        } catch (e) {
            //ignore for this test
        }
        expect(gameOne.players.get('1')!.obstacles.length).toBe(obstaclesCompletedLength);
    });

    it('should have a GameState of Started when the game has started and countdown has run', async () => {
        startGameAndAdvanceCountdown(gameOne);
        jest.advanceTimersByTime(gameOne.countdownTime);
        expect(gameOne.gameState).toBe(GameState.Started);
    });

    it('should have a GameState of Stopped when the game has stopped', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.stopGameUserClosed();
        expect(gameOne.gameState).toBe(GameState.Stopped);
    });

    it('should have a GameState of Finished when the game has finished', async () => {
        startGameAndAdvanceCountdown(gameOne);
        finishGame(gameOne);
        expect(gameOne.gameState).toBe(GameState.Finished);
    });

    it('game should finish when all active players have finished', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.disconnectPlayer('3');
        gameOne.disconnectPlayer('4');
        finishPlayer(gameOne, '1');
        finishPlayer(gameOne, '2');
        expect(gameOne.gameState).toBe(GameState.Finished);
    });

    it('should have a GameState of Created when new game is created', async () => {
        startGameAndAdvanceCountdown(gameOne);
        gameOne.stopGameUserClosed();
        gameOne.createNewGame(users);
        expect(gameOne.gameState).toBe(GameState.Created);
    });
});
