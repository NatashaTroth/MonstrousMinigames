import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { GameState } from '../../../../src/gameplay/enums';
import { getInitialParams } from '../../../../src/gameplay/gameOne/GameOneInitialParameters';
import { verifyGameState } from '../../../../src/gameplay/helperFunctions/verifyGameState';
import { leaderboard, roomId, users } from '../../mockData';
import {
    clearTimersAndIntervals, finishGame, finishPlayer, goToNextUnsolvableObstacle,
    startGameAndAdvanceCountdown
} from '../gameOneHelperFunctions';
import { playerHasCompletedObstacleMessage, runForwardMessage } from '../gameOneMockData';

let gameOne: GameOne;
const userId = '1';
const InitialParameters = getInitialParams();

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
        gameOne.receiveInput({ ...runForwardMessage, userId });
        expect(gameOne.players.get('1')!.positionX).toBe(initialPositionX);
    });

    it('should be able to move player once game has started and the countdown has run', async () => {
        startGameAndAdvanceCountdown(gameOne);
        const initialPositionX = gameOne.players.get('1')!.positionX;
        gameOne.receiveInput({ ...runForwardMessage, userId });
        expect(gameOne.players.get('1')!.positionX).toBe(initialPositionX + InitialParameters.SPEED);
    });

    it("shouldn't be able to move player when game is paused", async () => {
        startGameAndAdvanceCountdown(gameOne);
        const initialPositionX = gameOne.players.get('1')!.positionX;
        gameOne.pauseGame();
        gameOne.receiveInput({ ...runForwardMessage, userId });
        expect(gameOne.players.get('1')!.positionX).toBe(initialPositionX);
    });

    it("shouldn't be able to complete obstacle until game has started", async () => {
        gameOne.createNewGame(users, 1550, 4);
        // Countdown still has to run
        const obstaclesCompletedLength = gameOne.players.get('1')!.obstacles.length;
        gameOne.receiveInput({ ...playerHasCompletedObstacleMessage, userId });

        expect(gameOne.players.get('1')!.obstacles.length).toBe(obstaclesCompletedLength);
    });

    it("shouldn't be able to complete obstacle when game is paused", async () => {
        startGameAndAdvanceCountdown(gameOne);
        const obstaclesCompletedLength = gameOne.players.get('1')!.obstacles.length;
        gameOne.pauseGame();
        gameOne.receiveInput({ ...playerHasCompletedObstacleMessage, userId });

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
