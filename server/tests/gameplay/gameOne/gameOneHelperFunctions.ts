/* istanbul ignore file */
import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { GameOne } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import Game from '../../../src/gameplay/Game';
import * as InitialGameParameters from '../../../src/gameplay/gameOne/GameOneInitialParameters';
import { PlayerRank } from '../../../src/gameplay/gameOne/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { users } from '../mockData';

const TRACK_LENGTH = InitialGameParameters.TRACK_LENGTH;
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
    // jest.advanceTimersByTime(gameOne.timeOutLimit);
    try {
        game.stopGameUserClosed();
    } catch (e) {
        //no need to handle, game is already finished
    }
    // jest.runAllTimers();
    jest.clearAllMocks();
}

export function startGameAndAdvanceCountdown(gameOne: GameOne, afterCreate: () => any = () => void 0) {
    Date.now = () => dateNow;
    gameOne.createNewGame(users, TRACK_LENGTH, 4);
    afterCreate();
    gameOne.startGame();
    advanceCountdown(gameOne.countdownTime);
}
export function advanceCountdown(time: number) {
    //run countdown
    const previousNow = Date.now;
    Date.now = () => previousNow() + time;
    jest.advanceTimersByTime(time);
}

export function finishCreatedGame(gameOne: GameOne) {
    advanceCountdown(gameOne.countdownTime);
    return finishGame(gameOne);
}

export function startAndFinishGame(gameOne: GameOne): GameOne {
    startGameAndAdvanceCountdown(gameOne);
    gameOne = finishGame(gameOne);

    return gameOne;
}

export function finishGame(gameOne: GameOne): GameOne {
    const numberOfUsers = gameOne.players.size;
    for (let i = 1; i <= numberOfUsers; i++) {
        finishPlayer(gameOne, i.toString());
    }
    return gameOne;
}

export function finishPlayer(gameOne: GameOne, userId: string) {
    completePlayersObstacles(gameOne, userId);
    gameOne['runForward'](userId, gameOne.trackLength - gameOne.players.get(userId)!.positionX);
}

export function completePlayersObstacles(gameOne: GameOne, userId: string) {
    const player = gameOne.players.get(userId)!;
    if (player.obstacles.length > 0) {
        player.positionX = player.obstacles.pop()!.positionX;
        player.obstacles = [];
    }

    // gameOne.maxRunsPerFrame = Infinity; //To prevent going over speed limit
    // while (player.obstacles.length) {
    //     gameOne['runForward'](userId, distanceToNextObstacle(gameOne, userId));
    //     if (player.atObstacle) gameOne['playerHasCompletedObstacle'](userId, player.obstacles[0].id);
    // }
}

export function goToNextUnsolvableObstacle(gameOne: GameOne, userId: string) {
    const player = gameOne.players.get(userId)!;
    // gameOne.maxRunsPerFrame = Infinity; //To prevent going over speedlimit
    while (player.obstacles.length && !player.atObstacle) {
        gameOne['runForward'](userId, distanceToNextObstacle(gameOne, userId));
        player.countRunsPerFrame = 0; //To prevent going over speed limit
    }
}

export function completeNextObstacle(gameOne: GameOne, userId: string) {
    gameOne['runForward'](userId, distanceToNextObstacle(gameOne, userId));
    if (gameOne['playerHasReachedObstacle'](userId))
        gameOne['playerHasCompletedObstacle'](userId, gameOne.players.get(userId)!.obstacles[0].id);
}

export function distanceToNextObstacle(gameOne: GameOne, userId: string) {
    return gameOne.players.get(userId)!.obstacles[0].positionX - gameOne.players.get(userId)!.positionX;
}

export function runToNextObstacle(gameOne: GameOne, userId: string) {
    gameOne['runForward']('1', distanceToNextObstacle(gameOne, userId));
}

export async function startAndFinishGameDifferentTimes(gameOne: GameOne) {
    const dateNow = 1618665766156;
    Date.now = jest.fn(() => dateNow);
    startGameAndAdvanceCountdown(gameOne);
    // finish game
    for (let i = 1; i <= gameOne.numberOfObstacles; i++) {
        completePlayersObstacles(gameOne, i.toString());
    }

    advanceCountdown(1000);
    await releaseThreadN(3);
    gameOne['runForward']('1', TRACK_LENGTH);
    await releaseThreadN(3);
    advanceCountdown(4000);
    await releaseThreadN(3);
    gameOne['runForward']('2', TRACK_LENGTH);
    await releaseThreadN(3);
    advanceCountdown(5000);
    await releaseThreadN(3);
    gameOne['runForward']('3', TRACK_LENGTH);
    await releaseThreadN(3);
    advanceCountdown(5000);
    await releaseThreadN(3);
    gameOne['runForward']('4', TRACK_LENGTH);
    await releaseThreadN(3);
    return gameOne;
}

export async function getGameFinishedDataDifferentTimes(gameOne: GameOne) {
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
    gameOne = await startAndFinishGameDifferentTimes(gameOne);
    return eventData;
}

export function getGameFinishedDataSameRanks(gameOne: GameOne) {
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

    startGameAndAdvanceCountdown(gameOne);
    // finish game
    for (let i = 1; i <= gameOne.numberOfObstacles; i++) {
        completePlayersObstacles(gameOne, i.toString());
    }

    gameOne['runForward']('1', TRACK_LENGTH);
    gameOne['runForward']('2', TRACK_LENGTH);
    gameOne['runForward']('3', TRACK_LENGTH);
    Date.now = jest.fn(() => dateNow + 15000);
    gameOne['runForward']('4', TRACK_LENGTH);

    return eventData;
}

export async function getGameFinishedDataWithSomeDead(gameOne: GameOne) {
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
    gameOne = await startAndFinishGameDifferentTimes(gameOne);
    return eventData;
}

export function getToCreatedGameState(gameOne: GameOne) {
    gameOne.createNewGame(users);
    expect(gameOne.gameState).toBe(GameState.Created);
}

export function getToStartedGameState(gameOne: GameOne) {
    startGameAndAdvanceCountdown(gameOne);
    expect(gameOne.gameState).toBe(GameState.Started);
}

export function getToPausedGameState(gameOne: GameOne) {
    startGameAndAdvanceCountdown(gameOne);
    gameOne.pauseGame();
    expect(gameOne.gameState).toBe(GameState.Paused);
}

export function getToStoppedGameState(gameOne: GameOne) {
    startGameAndAdvanceCountdown(gameOne);
    gameOne.stopGameUserClosed();
    expect(gameOne.gameState).toBe(GameState.Stopped);
}

export function getToFinishedGameState(gameOne: GameOne) {
    startGameAndAdvanceCountdown(gameOne);
    finishGame(gameOne);
    expect(gameOne.gameState).toBe(GameState.Finished);
}
