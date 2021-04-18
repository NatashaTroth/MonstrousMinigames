import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/interfaces';
import { users } from '../mockUsers';

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
    for (let i = 0; i < 4; i++) {
        catchFoodGame.playerHasCompletedObstacle('1', i);
        catchFoodGame.playerHasCompletedObstacle('2', i);
        catchFoodGame.playerHasCompletedObstacle('3', i);
        catchFoodGame.playerHasCompletedObstacle('4', i);
    }

    catchFoodGame.runForward('1', TRACK_LENGTH);
    catchFoodGame.runForward('2', TRACK_LENGTH);
    catchFoodGame.runForward('3', TRACK_LENGTH);
    catchFoodGame.runForward('4', TRACK_LENGTH);
    return catchFoodGame;
}

export function startAndFinishGameDifferentTimes(catchFoodGame: CatchFoodGame) {
    const dateNow = 1618665766156;
    Date.now = jest.fn(() => dateNow);
    startGameAndAdvanceCountdown(catchFoodGame);
    // finish game
    for (let i = 0; i < 4; i++) {
        catchFoodGame.playerHasCompletedObstacle('1', i);
        catchFoodGame.playerHasCompletedObstacle('2', i);
        catchFoodGame.playerHasCompletedObstacle('3', i);
        catchFoodGame.playerHasCompletedObstacle('4', i);
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

// export function getGameFinishedData(catchFoodGame: CatchFoodGame): GameEvents.GameHasFinished {
//     let eventData: GameEvents.GameHasFinished = {
//         roomId: '',
//         gameState: GameState.Started,
//         trackLength: 0,
//         numberOfObstacles: 0,
//         playerRanks: [],
//     };
//     gameEventEmitter.on(GameEventTypes.GameHasFinished, (data: GameEvents.GameHasFinished) => {
//         eventData = data;
//     });
//     catchFoodGame = startAndFinishGame(catchFoodGame);
//     return eventData;
// }

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
    for (let i = 0; i < 4; i++) {
        catchFoodGame.playerHasCompletedObstacle('1', i);
        catchFoodGame.playerHasCompletedObstacle('2', i);
        catchFoodGame.playerHasCompletedObstacle('3', i);
        catchFoodGame.playerHasCompletedObstacle('4', i);
    }
    catchFoodGame.runForward('1', TRACK_LENGTH);
    catchFoodGame.runForward('2', TRACK_LENGTH);
    catchFoodGame.runForward('3', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 15000);
    catchFoodGame.runForward('4', TRACK_LENGTH);

    return eventData;
}
