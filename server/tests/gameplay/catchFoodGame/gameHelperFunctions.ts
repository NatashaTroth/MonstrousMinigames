import { CatchFoodGame } from '../../../src/gameplay';
import CatchFoodGameEventEmitter from '../../../src/gameplay/catchFood/CatchFoodGameEventEmitter';
import { GameEvents } from '../../../src/gameplay/catchFood/interfaces';
import { GameEventTypes, GameState } from '../../../src/gameplay/enums';
import Game from '../../../src/gameplay/Game';
import { users } from '../mockData';

const TRACK_LENGTH = 5000;
const gameEventEmitter = CatchFoodGameEventEmitter.getInstance();
const dateNow = 1618665766156;

export const releaseThread = () => new Promise<void>(resolve => resolve());
export const releaseThreadN = async (n: number) => {
    for (let i = 0; i < n; i++) {
        await releaseThread();
    }
};

export function clearTimersAndIntervals(game: Game) {
    //to clear intervals
    jest.advanceTimersByTime((game as CatchFoodGame).countdownTime || 0);
    // jest.advanceTimersByTime(catchFoodGame.timeOutLimit);
    try {
        game.stopGameUserClosed();
    } catch (e) {
        //no need to handle, game is already finished
    }
    jest.runAllTimers();
    jest.clearAllMocks();
}

export function startGameAndAdvanceCountdown(catchFoodGame: CatchFoodGame) {
    Date.now = () => dateNow;
    catchFoodGame.createNewGame(users, TRACK_LENGTH, 4, 1);
    advanceCountdown(catchFoodGame.countdownTime);
}
export function advanceCountdown(time: number) {
    //run countdown
    const previousNow = Date.now;
    Date.now = () => previousNow() + time;
    jest.advanceTimersByTime(time);
}

export function skipTimeToStartChasers(catchFoodGame: CatchFoodGame) {
    advanceCountdown(catchFoodGame.timeWhenChasersAppear);
}

export function finishCreatedGame(catchFoodGame: CatchFoodGame) {
    advanceCountdown(catchFoodGame.countdownTime);
    return finishGame(catchFoodGame);
}

export function startAndFinishGame(catchFoodGame: CatchFoodGame): CatchFoodGame {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame = finishGame(catchFoodGame);

    return catchFoodGame;
}

export function finishGame(catchFoodGame: CatchFoodGame): CatchFoodGame {
    const numberOfUsers = catchFoodGame.players.size;
    for (let i = 1; i <= numberOfUsers; i++) {
        finishPlayer(catchFoodGame, i.toString());
    }
    return catchFoodGame;
}

export function finishPlayer(catchFoodGame: CatchFoodGame, userId: string) {
    completePlayersObstacles(catchFoodGame, userId);
    catchFoodGame['runForward'](userId, catchFoodGame.trackLength - catchFoodGame.players.get(userId)!.positionX);
}

export function completePlayersObstacles(catchFoodGame: CatchFoodGame, userId: string) {
    for (let i = 0; i < catchFoodGame.numberOfObstacles + catchFoodGame.numberOfStones; i++) {
        const player = catchFoodGame.players.get(userId)!;
        catchFoodGame['runForward'](userId, distanceToNextObstacle(catchFoodGame, userId));
        catchFoodGame['playerHasCompletedObstacle'](userId, player.obstacles[0].id);
        player.stonesCarrying = 0;
    }
}

export function completeNextObstacle(catchFoodGame: CatchFoodGame, userId: string) {
    catchFoodGame['runForward'](userId, distanceToNextObstacle(catchFoodGame, userId));
    catchFoodGame['playerHasCompletedObstacle'](userId, catchFoodGame.players.get(userId)!.obstacles[0].id);
}

export function distanceToNextObstacle(catchFoodGame: CatchFoodGame, userId: string) {
    return catchFoodGame.players.get(userId)!.obstacles[0].positionX - catchFoodGame.players.get(userId)!.positionX;
}

export function runToNextObstacle(catchFoodGame: CatchFoodGame, userId: string) {
    catchFoodGame['runForward']('1', distanceToNextObstacle(catchFoodGame, userId));
}

export async function startAndFinishGameDifferentTimes(catchFoodGame: CatchFoodGame) {
    const dateNow = 1618665766156;
    Date.now = jest.fn(() => dateNow);
    startGameAndAdvanceCountdown(catchFoodGame);
    // finish game
    for (let i = 1; i <= catchFoodGame.numberOfObstacles; i++) {
        completePlayersObstacles(catchFoodGame, i.toString());
    }

    advanceCountdown(1000);
    await releaseThreadN(3);
    catchFoodGame['runForward']('1', TRACK_LENGTH);
    await releaseThreadN(3);
    advanceCountdown(4000);
    await releaseThreadN(3);
    catchFoodGame['runForward']('2', TRACK_LENGTH);
    await releaseThreadN(3);
    advanceCountdown(5000);
    await releaseThreadN(3);
    catchFoodGame['runForward']('3', TRACK_LENGTH);
    await releaseThreadN(3);
    advanceCountdown(5000);
    await releaseThreadN(3);
    catchFoodGame['runForward']('4', TRACK_LENGTH);
    await releaseThreadN(3);
    return catchFoodGame;
}

export async function getGameFinishedDataDifferentTimes(catchFoodGame: CatchFoodGame): Promise<GameEvents.GameHasFinished> {
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
    catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
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

    catchFoodGame['runForward']('1', TRACK_LENGTH);
    catchFoodGame['runForward']('2', TRACK_LENGTH);
    catchFoodGame['runForward']('3', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 15000);
    catchFoodGame['runForward']('4', TRACK_LENGTH);

    return eventData;
}

export async function getGameFinishedDataWithSomeDead(catchFoodGame: CatchFoodGame): Promise<GameEvents.GameHasFinished> {
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
    catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
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
