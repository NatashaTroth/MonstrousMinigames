import { CatchFoodGame } from '../../../src/gameplay';
import { verifyGameState } from '../../../src/gameplay/helperFunctions/verifyGameState';
import { GameState } from '../../../src/gameplay/interfaces';
import { leaderboard, roomId, users } from '../mockData';
import {
    completeNextObstacle, finishGame, finishPlayer, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

const TRACKLENGTH = 500;
const NUMBER_OF_OBSTACLES = 4;
let catchFoodGame: CatchFoodGame;

describe('Change and verify game state', () => {
    beforeEach(async () => {
        catchFoodGame = new CatchFoodGame(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('initialises state as initialised', async () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    it('sets state to created when new game is created ', async () => {
        catchFoodGame.createNewGame(users, TRACKLENGTH, NUMBER_OF_OBSTACLES);
        expect(catchFoodGame.gameState).toBe(GameState.Created);
    });

    it("shouldn't be able to move player until game has started", async () => {
        expect(() => verifyGameState(catchFoodGame.gameState, [GameState.Started])).toThrow();
    });

    it("shouldn't be able to move player until game has started and the countdown has run", async () => {
        catchFoodGame.createNewGame(users, 500, 4);
        const initialPositionX = catchFoodGame.playersState['1'].positionX;
        try {
            catchFoodGame.runForward('50');
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX);
    });

    it('should be able to move player once game has started and the countdown has run', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const initialPositionX = catchFoodGame.playersState['1'].positionX;
        catchFoodGame.runForward('1', 10);
        expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX + 10);
    });

    it("shouldn't be able to move player when game is paused", async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const initialPositionX = catchFoodGame.playersState['1'].positionX;
        catchFoodGame.pauseGame();
        try {
            catchFoodGame.runForward('50');
        } catch (e) {
            //ignore in this test
        }

        expect(catchFoodGame.playersState['1'].positionX).toBe(initialPositionX);
    });

    it("shouldn't be able to complete obstacle until game has started", async () => {
        catchFoodGame.createNewGame(users, 500, 4);
        // Countdown still has to run
        const obstaclesCompletedLength = catchFoodGame.playersState['1'].obstacles.length;
        try {
            catchFoodGame.playerHasCompletedObstacle('1', 0);
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(obstaclesCompletedLength);
    });

    it('should be able to complete obstacle when game has started', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const obstaclesCompletedLength = catchFoodGame.playersState['1'].obstacles.length;
        completeNextObstacle(catchFoodGame, '1');
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(obstaclesCompletedLength - 1);
    });

    it("shouldn't be able to complete obstacle when game is paused", async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        const obstaclesCompletedLength = catchFoodGame.playersState['1'].obstacles.length;
        catchFoodGame.pauseGame();
        try {
            catchFoodGame.playerHasCompletedObstacle('1', 0);
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.playersState['1'].obstacles.length).toBe(obstaclesCompletedLength);
    });

    it("shouldn't be able to stop game unless game has started", async () => {
        try {
            catchFoodGame.stopGame();
        } catch (e) {
            //ignore for this test
        }
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    it('should be able to stop game when started', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGame();
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });

    it('should be able to stop game when paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        catchFoodGame.stopGame();
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });

    it('should not have a GameState of Started until the game has started and countdown has run', async () => {
        catchFoodGame.createNewGame(users);
        expect(catchFoodGame.gameState).toBe(GameState.Created);
    });

    it('should have a GameState of Started when the game is started and countdown has run', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        jest.advanceTimersByTime(catchFoodGame.countdownTime);
        expect(catchFoodGame.gameState).toBe(GameState.Started);
    });

    it('should have a GameState of Stopped when the game is stopped', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGame();
        expect(catchFoodGame.gameState).toBe(GameState.Stopped);
    });

    it('should have a GameState of Finished when the game is finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        finishGame(catchFoodGame);
        expect(catchFoodGame.gameState).toBe(GameState.Finished);
    });

    it('game should finish when all active players have finished', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.disconnectPlayer('3');
        catchFoodGame.disconnectPlayer('4');
        finishPlayer(catchFoodGame, '1');
        finishPlayer(catchFoodGame, '2');
        expect(catchFoodGame.gameState).toBe(GameState.Finished);
    });

    it('should have a GameState of Created when new game is created', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGame();
        catchFoodGame.createNewGame(users);
        expect(catchFoodGame.gameState).toBe(GameState.Created);
    });
});
