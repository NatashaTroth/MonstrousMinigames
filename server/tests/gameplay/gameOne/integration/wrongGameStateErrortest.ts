import 'reflect-metadata';

import { GameOne } from '../../../../src/gameplay';
import { WrongGameStateError } from '../../../../src/gameplay/customErrors';
import { GameState } from '../../../../src/gameplay/enums';
import { leaderboard, roomId, users } from '../../mockData';
import {
    clearTimersAndIntervals, getToCreatedGameState, getToFinishedGameState, getToPausedGameState,
    getToStartedGameState, getToStoppedGameState, startGameAndAdvanceCountdown
} from './gameOneHelperFunctions';

let gameOne: GameOne;

describe('Create new game', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        gameOne = new GameOne(roomId, leaderboard);
    });

    afterEach(async () => {
        clearTimersAndIntervals(gameOne);
    });

    it('throws an error with requiredGameStates property on create game when wrong game state', () => {
        startGameAndAdvanceCountdown(gameOne);
        let errorThrown = false;
        try {
            gameOne.createNewGame(users);
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Initialised, GameState.Finished, GameState.Stopped].sort()).toEqual([
                ...e.requiredGameStates.sort(),
            ]);
        }
        expect(errorThrown).toBeTruthy();
    });

    it('throws an error on create game when game state is created', () => {
        getToCreatedGameState(gameOne);
        expect(() => gameOne.createNewGame(users)).toThrowError(WrongGameStateError);
    });

    it('throws an error on create game when game state is started', () => {
        getToStartedGameState(gameOne);
        expect(() => gameOne.createNewGame(users)).toThrowError(WrongGameStateError);
    });

    it('throws an error on create game when game state is paused', () => {
        getToPausedGameState(gameOne);
        expect(() => gameOne.createNewGame(users)).toThrowError(WrongGameStateError);
    });
});

describe('Pause game', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error with requiredGameStates property on pause game when wrong game state', () => {
        let errorThrown = false;
        try {
            gameOne.pauseGame();
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Started].sort()).toEqual([...e.requiredGameStates.sort()]);
        }
        expect(errorThrown).toBeTruthy();
    });

    it('throws an error on pause game when game state is Initialised', () => {
        expect(gameOne.gameState).toBe(GameState.Initialised);
        expect(() => gameOne.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Created', () => {
        getToCreatedGameState(gameOne);
        expect(() => gameOne.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Paused', () => {
        getToPausedGameState(gameOne);
        expect(() => gameOne.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Stopped', () => {
        getToStoppedGameState(gameOne);
        expect(() => gameOne.pauseGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on pause game when game state is Finished', () => {
        getToFinishedGameState(gameOne);
        expect(() => gameOne.pauseGame()).toThrowError(WrongGameStateError);
    });
});

describe('Resume game', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error with requiredGameStates property on resume game when wrong game state', () => {
        let errorThrown = false;
        try {
            getToCreatedGameState(gameOne);
            gameOne.resumeGame();
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Paused].sort()).toEqual([...e.requiredGameStates.sort()]);
        }
        expect(errorThrown).toBeTruthy();
    });

    it('throws an error on resume game when game state is Initialised', () => {
        expect(gameOne.gameState).toBe(GameState.Initialised);
        expect(() => gameOne.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Created', () => {
        getToCreatedGameState(gameOne);
        expect(() => gameOne.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Started', () => {
        getToStartedGameState(gameOne);
        expect(() => gameOne.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Stopped', () => {
        getToStoppedGameState(gameOne);
        expect(() => gameOne.resumeGame()).toThrowError(WrongGameStateError);
    });

    it('throws an error on resume game when game state is Finished', () => {
        getToFinishedGameState(gameOne);
        expect(() => gameOne.resumeGame()).toThrowError(WrongGameStateError);
    });
});

describe('Stop game', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error with requiredGameStates property on stop game when wrong game state', () => {
        let errorThrown = false;
        try {
            getToCreatedGameState(gameOne);
            gameOne.stopGameUserClosed();
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Started, GameState.Paused].sort()).toEqual(e.requiredGameStates.sort());
        }
        expect(errorThrown).toBeTruthy();
    });
    it('throws an error on stop game when game state is Initialised', () => {
        expect(gameOne.gameState).toBe(GameState.Initialised);
        expect(() => gameOne.stopGameUserClosed()).toThrowError(WrongGameStateError);
    });

    it('throws an error on stop game when game state is Created', () => {
        getToCreatedGameState(gameOne);
        expect(() => gameOne.stopGameUserClosed()).toThrowError(WrongGameStateError);
    });

    it('throws an error on stop game when game state is Stopped', () => {
        getToStoppedGameState(gameOne);
        expect(() => gameOne.stopGameUserClosed()).toThrowError(WrongGameStateError);
    });

    it('throws an error on stop game when game state is Finished', () => {
        getToFinishedGameState(gameOne);
        expect(() => gameOne.stopGameUserClosed()).toThrowError(WrongGameStateError);
    });
});

describe('Run forward', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error with requiredGameStates property on runForward when wrong game state', () => {
        let errorThrown = false;
        try {
            gameOne['runForward']('1');
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Started].sort()).toEqual(e.requiredGameStates.sort());
        }
        expect(errorThrown).toBeTruthy();
    });
    it('should throw a WrongGameStateError on runForward when game state is Initialised', async () => {
        expect(gameOne.gameState).toBe(GameState.Initialised);
        expect(() => gameOne['runForward']('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Created', async () => {
        getToCreatedGameState(gameOne);
        expect(() => gameOne['runForward']('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Paused', async () => {
        getToPausedGameState(gameOne);
        expect(() => gameOne['runForward']('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Stopped', async () => {
        getToStoppedGameState(gameOne);
        expect(() => gameOne['runForward']('1')).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on runForward when game state is Finished', async () => {
        getToFinishedGameState(gameOne);
        expect(() => gameOne['runForward']('1')).toThrow(WrongGameStateError);
    });
});

describe('Player has completed obstacle', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error with requiredGameStates property on playerHasCompletedObstacle when wrong game state', () => {
        let errorThrown = false;
        try {
            gameOne['playerHasCompletedObstacle']('1', 1);
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Started].sort()).toEqual(e.requiredGameStates.sort());
        }
        expect(errorThrown).toBeTruthy();
    });
    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Initialised', async () => {
        expect(gameOne.gameState).toBe(GameState.Initialised);
        expect(() => gameOne['playerHasCompletedObstacle']('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Created', async () => {
        getToCreatedGameState(gameOne);
        expect(() => gameOne['playerHasCompletedObstacle']('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Paused', async () => {
        getToPausedGameState(gameOne);
        expect(() => gameOne['playerHasCompletedObstacle']('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Stopped', async () => {
        getToStoppedGameState(gameOne);
        expect(() => gameOne['playerHasCompletedObstacle']('1', 1)).toThrow(WrongGameStateError);
    });

    it('should throw a WrongGameStateError on playerHasCompletedObstacle when game state is Finished', async () => {
        getToFinishedGameState(gameOne);
        expect(() => gameOne['playerHasCompletedObstacle']('1', 1)).toThrow(WrongGameStateError);
    });
});

describe('Disconnect player', () => {
    beforeEach(() => {
        gameOne = new GameOne(roomId, leaderboard);
        jest.useFakeTimers();
    });

    it('throws an error with requiredGameStates property on disconnectPlayer when wrong game state', () => {
        let errorThrown = false;
        try {
            getToStoppedGameState(gameOne);
            gameOne.disconnectPlayer('1');
        } catch (e: any) {
            errorThrown = true;
            expect([GameState.Initialised, GameState.Started, GameState.Created, GameState.Paused].sort()).toEqual(
                e.requiredGameStates.sort()
            );
        }
        expect(errorThrown).toBeTruthy();
    });
    it('throws a WrongGameStateError when trying to disconnect player when game has stopped', async () => {
        getToStoppedGameState(gameOne);
        expect(() => gameOne.disconnectPlayer('1')).toThrow(WrongGameStateError);
    });

    it('throws a WrongGameStateError when trying to disconnect player when game has finished', async () => {
        getToFinishedGameState(gameOne);
        expect(() => gameOne.disconnectPlayer('1')).toThrow(WrongGameStateError);
    });
});
