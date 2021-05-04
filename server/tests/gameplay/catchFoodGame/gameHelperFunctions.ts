import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import { users } from '../mockData';

const TRACK_LENGTH = 500;
const gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
const dateNow = 1618665766156;

export function startGameAndAdvanceCountdown(catchFoodGameInstance: CatchFoodGame) {
    catchFoodGameInstance.createNewGame(users, TRACK_LENGTH, 4);
    //run countdown
    jest.advanceTimersByTime(3000);
}

export function startAndFinishGame(catchFoodGame: CatchFoodGame): CatchFoodGame {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame = finishGame(catchFoodGame);

    return catchFoodGame;
}

export function finishGame(catchFoodGame: CatchFoodGame): CatchFoodGame {
    for (let i = 1; i <= catchFoodGame.numberOfObstacles; i++) {
        finishPlayer(catchFoodGame, i.toString());
    }

    return catchFoodGame;
}

export function finishPlayer(catchFoodGame: CatchFoodGame, userId: string) {
    completePlayersObstacles(catchFoodGame, userId);
    catchFoodGame.runForward(userId, TRACK_LENGTH - catchFoodGame.playersState[userId].positionX);
}

export function completePlayersObstacles(catchFoodGame: CatchFoodGame, userId: string) {
    for (let i = 0; i < catchFoodGame.numberOfObstacles; i++) {
        catchFoodGame.runForward(userId, distanceToNextObstacle(catchFoodGame, userId));
        catchFoodGame.playerHasCompletedObstacle(userId, i);
    }
}

export function completeNextObstacle(catchFoodGame: CatchFoodGame, userId: string) {
    catchFoodGame.runForward(userId, distanceToNextObstacle(catchFoodGame, userId));
    catchFoodGame.playerHasCompletedObstacle(userId, catchFoodGame.playersState[userId].obstacles[0].id);
}

export function distanceToNextObstacle(catchFoodGame: CatchFoodGame, userId: string) {
    return catchFoodGame.playersState[userId].obstacles[0].positionX - catchFoodGame.playersState[userId].positionX;
}

export function runToNextObstacle(catchFoodGame: CatchFoodGame, userId: string) {
    catchFoodGame.runForward('1', distanceToNextObstacle(catchFoodGame, userId));
}

export function startAndFinishGameDifferentTimes(catchFoodGame: CatchFoodGame) {
    const dateNow = 1618665766156;
    Date.now = jest.fn(() => dateNow);
    startGameAndAdvanceCountdown(catchFoodGame);
    // finish game
    for (let i = 1; i <= catchFoodGame.numberOfObstacles; i++) {
        completePlayersObstacles(catchFoodGame, i.toString());
    }

    Date.now = jest.fn(() => dateNow + 1000);
    catchFoodGame.runForward('1', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 5000);
    catchFoodGame.runForward('2', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 10000);
    catchFoodGame.runForward('3', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 15000);
    catchFoodGame.runForward('4', TRACK_LENGTH);
    return catchFoodGame;
}

export function getGameFinishedDataDifferentTimes(catchFoodGame: CatchFoodGame): GameEvents.GameHasFinished {
    let eventData: GameEvents.GameHasFinished = {
        roomId: '',
        gameState: GameState.Started,
        trackLength: 0,
        numberOfObstacles: 0,
        playerRanks: [],
    };
    gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameEvents.GameHasFinished) => {
        eventData = data;
    });
    catchFoodGame = startAndFinishGameDifferentTimes(catchFoodGame);
    return eventData;
}

export function getGameFinishedDataSameRanks(catchFoodGame: CatchFoodGame) {
    let eventData: GameEvents.GameHasFinished = {
        roomId: '',
        gameState: GameState.Started,
        trackLength: 0,
        numberOfObstacles: 0,
        playerRanks: [],
    };

    gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameEvents.GameHasFinished) => {
        eventData = data;
    });

    startGameAndAdvanceCountdown(catchFoodGame);
    // finish game
    for (let i = 1; i <= catchFoodGame.numberOfObstacles; i++) {
        completePlayersObstacles(catchFoodGame, i.toString());
    }

    catchFoodGame.runForward('1', TRACK_LENGTH);
    catchFoodGame.runForward('2', TRACK_LENGTH);
    catchFoodGame.runForward('3', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 15000);
    catchFoodGame.runForward('4', TRACK_LENGTH);

    return eventData;
}

export function getToCreatedGameState(catchFoodGame: CatchFoodGame) {
    catchFoodGame.createNewGame(users);
    expect(catchFoodGame.gameState).toBe(GameState.Created);
}

export function getToStartedGameState(catchFoodGame: CatchFoodGame) {
    startGameAndAdvanceCountdown(catchFoodGame);
    expect(catchFoodGame.gameState).toBe(GameState.Started);
}

export function getToPausedGameState(catchFoodGame: CatchFoodGame) {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame.pauseGame();
    expect(catchFoodGame.gameState).toBe(GameState.Paused);
}

export function getToStoppedGameState(catchFoodGame: CatchFoodGame) {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame.stopGameUserClosed();
    expect(catchFoodGame.gameState).toBe(GameState.Stopped);
}

export function getToFinishedGameState(catchFoodGame: CatchFoodGame) {
    startGameAndAdvanceCountdown(catchFoodGame);
    finishGame(catchFoodGame);
    expect(catchFoodGame.gameState).toBe(GameState.Finished);
}
