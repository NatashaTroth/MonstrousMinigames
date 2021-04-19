import { CatchFoodGame } from '../../../src/gameplay';
import { WrongGameStateError } from '../../../src/gameplay/customErrors';
import { GameState } from '../../../src/gameplay/interfaces';
import { users } from '../mockUsers';
import {
    startAndFinishGameDifferentTimes, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;

describe('WrongGameStateError handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    it('throws an error on create game when wrong game state', () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        expect(() => catchFoodGame.createNewGame(users)).toThrowError(WrongGameStateError);
    });

    it('throws an error with requiredGameStates property on create game when wrong game state', () => {
        startGameAndAdvanceCountdown(catchFoodGame);

        try {
            catchFoodGame.createNewGame(users);
        } catch (e) {
            expect([GameState.Initialised, GameState.Finished, GameState.Stopped].sort()).toEqual(
                e.requiredGameStates.sort()
            );
        }
    });

    it('throws an error on pause game when wrong game state', () => {
        expect(() => catchFoodGame.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error with requiredGameStates property on pause game when wrong game state', () => {
        try {
            catchFoodGame.pauseGame();
        } catch (e) {
            expect([GameState.Started].sort()).toEqual(e.requiredGameStates.sort());
        }
    });

    // -- Gamestate --
    it('should throw a WrongGameStateError when move player until game has started and the countdown has run', async () => {
        catchFoodGame.createNewGame(users, 500, 4);
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });
    it('should throw a WrongGameStateError when try to move player when game is paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });
    it('should throw a WrongGameStateError when trying to complete obstacle before game has started', async () => {
        catchFoodGame.createNewGame(users, 500, 4);
        // Countdown still has to run
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 0)).toThrow(WrongGameStateError);
    });
    it('should throw a WrongGameStateError when trying to complete obstacle when game is paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.pauseGame();
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 0)).toThrow(WrongGameStateError);
    });

    it("shouldn't be able to stop game unless game has started", async () => {
        expect(() => catchFoodGame.stopGame()).toThrow(WrongGameStateError);
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
    });

    // -- Disconnected User --

    it('throws a WrongGameStateError when trying to disconnect player when game has stopped', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        catchFoodGame.stopGame();
        expect(() => catchFoodGame.disconnectPlayer('1')).toThrow(WrongGameStateError);
    });

    it('throws a WrongGameStateError when trying to disconnect player when game has finished', async () => {
        startAndFinishGameDifferentTimes(catchFoodGame);
        expect(() => catchFoodGame.disconnectPlayer('1')).toThrow(WrongGameStateError);
    });

    // -- Pause and Resume --
    it('Throws a WrongGameStateError when trying to pause a game that has not started', async () => {
        expect(() => catchFoodGame.pauseGame()).toThrow(WrongGameStateError);
    });
    it('throws a WrongGameStateError when calling resume and a game has not started', async () => {
        expect(() => catchFoodGame.resumeGame()).toThrow(WrongGameStateError);
    });
    it('throws a WrongGameStateError when trying to resume game when game has not been paused', async () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        expect(() => catchFoodGame.resumeGame()).toThrow(WrongGameStateError);
        expect(catchFoodGame.gameState).toBe(GameState.Started);
    });
});
