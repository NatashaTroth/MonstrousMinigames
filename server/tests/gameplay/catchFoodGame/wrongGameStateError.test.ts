import { CatchFoodGame } from '../../../src/gameplay';
import { WrongGameStateError } from '../../../src/gameplay/customErrors';
import { GameState } from '../../../src/gameplay/interfaces';
import { users } from '../mockUsers';
import {
    getToCreatedGameState, getToFinishedGameState, getToPausedGameState, getToStartedGameState,
    getToStoppedGameState, startGameAndAdvanceCountdown
} from './gameHelperFunctions';

let catchFoodGame: CatchFoodGame;

describe('WrongGameStateError handling tests', () => {
    beforeEach(() => {
        catchFoodGame = new CatchFoodGame();
        jest.useFakeTimers();
    });

    // -- createNewGame --

    it('throws an error with requiredGameStates property on create game when wrong game state', () => {
        startGameAndAdvanceCountdown(catchFoodGame);
        let errorThrown = false;
        try {
            catchFoodGame.createNewGame(users);
        } catch (e) {
            errorThrown = true;
            expect([GameState.Initialised, GameState.Finished, GameState.Stopped].sort()).toEqual([
                ...e.requiredGameStates.sort(),
            ]);
        }
        expect(errorThrown).toBeTruthy();
    });

    it('throws an error on create game when game state is created', () => {
        getToCreatedGameState(catchFoodGame);
        expect(() => catchFoodGame.createNewGame(users)).toThrowError(WrongGameStateError);
    });

    it('throws an error on create game when game state is started', () => {
        getToStartedGameState(catchFoodGame);
        expect(() => catchFoodGame.createNewGame(users)).toThrowError(WrongGameStateError);
    });

    it('throws an error on create game when game state is paused', () => {
        getToPausedGameState(catchFoodGame);
        expect(() => catchFoodGame.createNewGame(users)).toThrowError(WrongGameStateError);
    });

    // -- Pause game --
    it('throws an error with requiredGameStates property on pause game when wrong game state', () => {
        let errorThrown = false;
        try {
            catchFoodGame.pauseGame();
        } catch (e) {
            errorThrown = true;
            expect([GameState.Started].sort()).toEqual([...e.requiredGameStates.sort()]);
        }
        expect(errorThrown).toBeTruthy();
    });

    it('throws an error on pause game when game state is Initialised', () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
        expect(() => catchFoodGame.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Created', () => {
        getToCreatedGameState(catchFoodGame);
        expect(() => catchFoodGame.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Paused', () => {
        getToPausedGameState(catchFoodGame);
        expect(() => catchFoodGame.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Stopped', () => {
        getToStoppedGameState(catchFoodGame);
        expect(() => catchFoodGame.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Finished', () => {
        getToFinishedGameState(catchFoodGame);
        expect(() => catchFoodGame.pauseGame()).toThrowError(WrongGameStateError);
    });

    // -- Resume game --
    it('throws an error with requiredGameStates property on resume game when wrong game state', () => {
        let errorThrown = false;
        try {
            getToCreatedGameState(catchFoodGame);
            catchFoodGame.resumeGame();
        } catch (e) {
            errorThrown = true;
            expect([GameState.Paused].sort()).toEqual([...e.requiredGameStates.sort()]);
        }
        expect(errorThrown).toBeTruthy();
    });

    it('throws an error on resume game when game state is Initialised', () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
        expect(() => catchFoodGame.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Created', () => {
        getToCreatedGameState(catchFoodGame);
        expect(() => catchFoodGame.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Started', () => {
        getToStartedGameState(catchFoodGame);
        expect(() => catchFoodGame.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Stopped', () => {
        getToStoppedGameState(catchFoodGame);
        expect(() => catchFoodGame.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Finished', () => {
        getToFinishedGameState(catchFoodGame);
        expect(() => catchFoodGame.resumeGame()).toThrowError(WrongGameStateError);
    });

    // -- Stop game --
    it('throws an error with requiredGameStates property on stop game when wrong game state', () => {
        let errorThrown = false;
        try {
            getToCreatedGameState(catchFoodGame);
            catchFoodGame.stopGame();
        } catch (e) {
            errorThrown = true;
            expect([GameState.Started, GameState.Paused].sort()).toEqual(e.requiredGameStates.sort());
        }
        expect(errorThrown).toBeTruthy();
    });
    it('throws an error on stop game when game state is Initialised', () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
        expect(() => catchFoodGame.stopGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on stop game when game state is Created', () => {
        getToCreatedGameState(catchFoodGame);
        expect(() => catchFoodGame.stopGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on stop game when game state is Stopped', () => {
        getToStoppedGameState(catchFoodGame);
        expect(() => catchFoodGame.stopGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on stop game when game state is Finished', () => {
        getToFinishedGameState(catchFoodGame);
        expect(() => catchFoodGame.stopGame()).toThrowError(WrongGameStateError);
    });

    // -- Run forward --
    it('throws an error with requiredGameStates property on runForward when wrong game state', () => {
        let errorThrown = false;
        try {
            catchFoodGame.runForward('1');
        } catch (e) {
            errorThrown = true;
            expect([GameState.Started].sort()).toEqual(e.requiredGameStates.sort());
        }
        expect(errorThrown).toBeTruthy();
    });
    it('should throw a WrongGameStateError on runForward when game state is Initialised', async () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Created', async () => {
        getToCreatedGameState(catchFoodGame);
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Paused', async () => {
        getToPausedGameState(catchFoodGame);
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Stopped', async () => {
        getToStoppedGameState(catchFoodGame);
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Finished', async () => {
        getToFinishedGameState(catchFoodGame);
        expect(() => catchFoodGame.runForward('1')).toThrow(WrongGameStateError);
    });

    // -- PlayerHasCompletedObstacle --
    it('throws an error with requiredGameStates property on playerHasCompletedObstacle when wrong game state', () => {
        let errorThrown = false;
        try {
            catchFoodGame.playerHasCompletedObstacle('1', 1);
        } catch (e) {
            errorThrown = true;
            expect([GameState.Started].sort()).toEqual(e.requiredGameStates.sort());
        }
        expect(errorThrown).toBeTruthy();
    });
    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Initialised', async () => {
        expect(catchFoodGame.gameState).toBe(GameState.Initialised);
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Created', async () => {
        getToCreatedGameState(catchFoodGame);
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Paused', async () => {
        getToPausedGameState(catchFoodGame);
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Stopped', async () => {
        getToStoppedGameState(catchFoodGame);
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Finished', async () => {
        getToFinishedGameState(catchFoodGame);
        expect(() => catchFoodGame.playerHasCompletedObstacle('1', 1)).toThrow(WrongGameStateError);
    });

    // -- DisconnectPlayer --
    it('throws an error with requiredGameStates property on disconnectPlayer when wrong game state', () => {
        let errorThrown = false;
        try {
            getToStoppedGameState(catchFoodGame);
            catchFoodGame.disconnectPlayer('1');
        } catch (e) {
            errorThrown = true;
            expect([GameState.Initialised, GameState.Started, GameState.Created, GameState.Paused].sort()).toEqual(
                e.requiredGameStates.sort()
            );
        }
        expect(errorThrown).toBeTruthy();
    });
    it('throws a WrongGameStateError when trying to disconnect player when game has stopped', async () => {
        getToStoppedGameState(catchFoodGame);
        expect(() => catchFoodGame.disconnectPlayer('1')).toThrow(WrongGameStateError);
    });

    it('throws a WrongGameStateError when trying to disconnect player when game has finished', async () => {
        getToFinishedGameState(catchFoodGame);
        expect(() => catchFoodGame.disconnectPlayer('1')).toThrow(WrongGameStateError);
    });
});
