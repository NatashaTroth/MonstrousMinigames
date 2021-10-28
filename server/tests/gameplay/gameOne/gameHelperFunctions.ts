import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { GameOne } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import Game from '../../../src/gameplay/Game';
import { PlayerRank } from '../../../src/gameplay/gameOne/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { users } from '../mockData';

const TRACK_LENGTH = 5000;
const gameEventEmitter = DI.resolve(GameEventEmitter);
const dateNow = 1618665766156;

export const releaseThread = () => new Promise<void>(resolve => resolve());
export const releaseThreadN = async (n: number) => {
    for (let i = 0; i < n; i++) {
        await releaseThread();
    }
};

export function clearTimersAndIntervals(game: Game) {
    //to clear intervals
    jest.advanceTimersByTime((game as GameOne).countdownTime || 0);
    // jest.advanceTimersByTime(catchFoodGame.timeOutLimit);
    try {
        game.stopGameUserClosed();
    } catch (e) {
        //no need to handle, game is already finished
    }
    // jest.runAllTimers();
    jest.clearAllMocks();
}

export function startGameAndAdvanceCountdown(catchFoodGame: GameOne, afterCreate: () => any = () => void 0) {
    Date.now = () => dateNow;
    catchFoodGame.createNewGame(users, TRACK_LENGTH, 4);
    afterCreate();
    catchFoodGame.startGame();
    advanceCountdown(catchFoodGame.countdownTime);
}
export function advanceCountdown(time: number) {
    //run countdown
    const previousNow = Date.now;
    Date.now = () => previousNow() + time;
    jest.advanceTimersByTime(time);
}

export function finishCreatedGame(catchFoodGame: GameOne) {
    advanceCountdown(catchFoodGame.countdownTime);
    return finishGame(catchFoodGame);
}

export function startAndFinishGame(catchFoodGame: GameOne): GameOne {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame = finishGame(catchFoodGame);

    return catchFoodGame;
}

export function finishGame(catchFoodGame: GameOne): GameOne {
    const numberOfUsers = catchFoodGame.players.size;
    for (let i = 1; i <= numberOfUsers; i++) {
        finishPlayer(catchFoodGame, i.toString());
    }
    return catchFoodGame;
}

export function finishPlayer(catchFoodGame: GameOne, userId: string) {
    completePlayersObstacles(catchFoodGame, userId);
    catchFoodGame['runForward'](userId, catchFoodGame.trackLength - catchFoodGame.players.get(userId)!.positionX);
}

export function completePlayersObstacles(catchFoodGame: GameOne, userId: string) {
    const player = catchFoodGame.players.get(userId)!;

    while (player.obstacles.length) {
        catchFoodGame['runForward'](userId, distanceToNextObstacle(catchFoodGame, userId));
        if (player.atObstacle) catchFoodGame['playerHasCompletedObstacle'](userId, player.obstacles[0].id);
    }
}

export function goToNextUnsolvableObstacle(catchFoodGame: GameOne, userId: string) {
    const player = catchFoodGame.players.get(userId)!;

    while (player.obstacles.length && !player.atObstacle) {
        catchFoodGame['runForward'](userId, distanceToNextObstacle(catchFoodGame, userId));
    }
}

export function completeNextObstacle(catchFoodGame: GameOne, userId: string) {
    catchFoodGame['runForward'](userId, distanceToNextObstacle(catchFoodGame, userId));
    if (catchFoodGame['playerHasReachedObstacle'](userId))
        catchFoodGame['playerHasCompletedObstacle'](userId, catchFoodGame.players.get(userId)!.obstacles[0].id);
}

export function distanceToNextObstacle(catchFoodGame: GameOne, userId: string) {
    return catchFoodGame.players.get(userId)!.obstacles[0].positionX - catchFoodGame.players.get(userId)!.positionX;
}

export function runToNextObstacle(catchFoodGame: GameOne, userId: string) {
    catchFoodGame['runForward']('1', distanceToNextObstacle(catchFoodGame, userId));
}

export async function startAndFinishGameDifferentTimes(catchFoodGame: GameOne) {
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

export async function getGameFinishedDataDifferentTimes(catchFoodGame: GameOne) {
    let eventData = {
        roomId: '',
        gameState: GameState.Started,
        playerRanks: [] as PlayerRank[],
    };
    gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
        if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
            eventData = message.data as any;
        }
    });
    catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
    return eventData;
}

export function getGameFinishedDataSameRanks(catchFoodGame: GameOne) {
    let eventData = {
        roomId: '',
        gameState: GameState.Started,
        playerRanks: [] as PlayerRank[],
    };

    gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
        if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
            eventData = message.data as any;
        }
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

export async function getGameFinishedDataWithSomeDead(catchFoodGame: GameOne) {
    let eventData = {
        roomId: '',
        gameState: GameState.Started,
        playerRanks: [] as PlayerRank[],
    };
    gameEventEmitter.on(GameEventEmitter.EVENT_MESSAGE_EVENT, (message: GlobalEventMessage) => {
        if (message.type === GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED) {
            eventData = message.data as any;
        }
    });
    catchFoodGame = await startAndFinishGameDifferentTimes(catchFoodGame);
    return eventData;
}

export function getToCreatedGameState(catchFoodGame: GameOne) {
    catchFoodGame.createNewGame(users);
    expect(catchFoodGame.gameState).toBe(GameState.Created);
}

export function getToStartedGameState(catchFoodGame: GameOne) {
    startGameAndAdvanceCountdown(catchFoodGame);
    expect(catchFoodGame.gameState).toBe(GameState.Started);
}

export function getToPausedGameState(catchFoodGame: GameOne) {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame.pauseGame();
    expect(catchFoodGame.gameState).toBe(GameState.Paused);
}

export function getToStoppedGameState(catchFoodGame: GameOne) {
    startGameAndAdvanceCountdown(catchFoodGame);
    catchFoodGame.stopGameUserClosed();
    expect(catchFoodGame.gameState).toBe(GameState.Stopped);
}

export function getToFinishedGameState(catchFoodGame: GameOne) {
    startGameAndAdvanceCountdown(catchFoodGame);
    finishGame(catchFoodGame);
    expect(catchFoodGame.gameState).toBe(GameState.Finished);
}
