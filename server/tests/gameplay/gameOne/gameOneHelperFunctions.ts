/* istanbul ignore file */
import GameEventEmitter from '../../../src/classes/GameEventEmitter';
import DI from '../../../src/di';
import { GameOne } from '../../../src/gameplay';
import { GameState } from '../../../src/gameplay/enums';
import Game from '../../../src/gameplay/Game';
import { getInitialParams } from '../../../src/gameplay/gameOne/GameOneInitialParameters';
import GameOnePlayer from '../../../src/gameplay/gameOne/GameOnePlayer';
import { IMessageObstacle, PlayerRank } from '../../../src/gameplay/gameOne/interfaces';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GlobalEventMessage
} from '../../../src/gameplay/interfaces/GlobalEventMessages';
import { users } from '../mockData';
import { playerHasCompletedObstacleMessage, runForwardMessage } from './gameOneMockData';

const InitialGameParameters = getInitialParams();
const TRACK_LENGTH = InitialGameParameters.TRACK_LENGTH;
const gameEventEmitter = DI.resolve(GameEventEmitter);
const dateNow = 1618665766156;

/***********************************************************************************/
/* Only call private functions/properties in this file and only when necessary */
/***********************************************************************************/

export function advanceCountdown(gameOne: GameOne, timeMs: number) {
    gameOne['update'](10, timeMs);
    const previousNow = Date.now;
    Date.now = () => previousNow() + timeMs;
    jest.advanceTimersByTime(timeMs);
}

export function finishPlayer(gameOne: GameOne, userId: string) {
    //MAX FRAME PROBLEM
    const player = [...gameOne.gameOnePlayersController!.getPlayerValues()][Number(userId) - 1];
    completeObstacles(gameOne, player);
    runToEnd(gameOne, player);
}

export function completeObstacles(gameOne: GameOne, player: GameOnePlayer) {
    const obstacles = [...player.obstacles];
    for (let i = 0; i < obstacles.length; i++) {
        goToNextUnsolvableObstacle(gameOne, player);
        gameOne.receiveInput({
            ...playerHasCompletedObstacleMessage,
            userId: player.id,
            obstacleId: obstacles[i].id,
        } as IMessageObstacle);
    }
}

export function runToEnd(gameOne: GameOne, player: GameOnePlayer) {
    let counter = 0;
    while (
        !player.atObstacle &&
        player.positionX < gameOne.trackLength &&
        !player.finished &&
        gameOne.gameState === GameState.Started
    ) {
        runForwardNoLimit(gameOne, player);
        counter++;
        if (counter > gameOne.trackLength) break;
    }
}

export function runForwardNoLimit(gameOne: GameOne, player: GameOnePlayer) {
    player.countRunsPerFrame = 0;
    gameOne.receiveInput({ ...runForwardMessage, userId: player.id }); // should be 1st (fastest to finish)
}

export const releaseThread = () => new Promise<void>(resolve => resolve());
export const releaseThreadN = async (n: number) => {
    for (let i = 0; i < n; i++) {
        await releaseThread();
    }
};

export function clearTimersAndIntervals(game: Game) {
    //to clear intervals
    jest.advanceTimersByTime((game as GameOne).countdownTime || 0);
    try {
        game.stopGameUserClosed();
    } catch (e) {
        //no need to handle, game is already finished
    }
    jest.clearAllMocks();
}

export function startGameAndAdvanceCountdown(gameOne: GameOne, afterCreate: () => any = () => void 0) {
    Date.now = () => dateNow;
    gameOne.createNewGame(users, TRACK_LENGTH, 4);
    afterCreate();
    gameOne.startGame();
    advanceStartCountdown(gameOne.countdownTime);
}
export function advanceStartCountdown(time: number) {
    //run countdown
    const previousNow = Date.now;
    Date.now = () => previousNow() + time;
    jest.advanceTimersByTime(time);
}

export function finishCreatedGame(gameOne: GameOne) {
    advanceCountdown(gameOne, gameOne.countdownTime);
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
    advanceCountdown(gameOne, 10); //call update to check if game has finished and to handle game finished
    return gameOne;
}

export function goToNextUnsolvableObstacle(gameOne: GameOne, player: GameOnePlayer) {
    // gameOne.maxRunsPerFrame = Infinity; //To prevent going over speedlimit
    let counter = 0;
    while (
        !player.atObstacle &&
        player.positionX < gameOne.trackLength &&
        !player.finished &&
        gameOne.gameState === GameState.Started
    ) {
        runForwardNoLimit(gameOne, player);
        counter++;
        if (counter > gameOne.trackLength) break;
        player.countRunsPerFrame = 0; //To prevent going over speed limit
    }
}

export async function startAndFinishGameDifferentTimes(gameOne: GameOne, timesFinished = [1000, 5000, 10000, 15000]) {
    const dateNow = 1618665766156;
    Date.now = jest.fn(() => dateNow);
    startGameAndAdvanceCountdown(gameOne);

    advanceCountdown(gameOne, timesFinished[0]);
    await releaseThreadN(3);
    finishPlayer(gameOne, '1');

    await releaseThreadN(3);
    advanceCountdown(gameOne, timesFinished[1] - timesFinished[0]);
    await releaseThreadN(3);
    finishPlayer(gameOne, '2');

    await releaseThreadN(3);
    advanceCountdown(gameOne, timesFinished[2] - timesFinished[1]);
    await releaseThreadN(3);
    finishPlayer(gameOne, '3');

    await releaseThreadN(3);
    advanceCountdown(gameOne, timesFinished[3] - timesFinished[2]);
    await releaseThreadN(3);
    finishPlayer(gameOne, '4');

    await releaseThreadN(3);
    return gameOne;
}

export async function startAndAllPlayersCaughtSameTime(gameOne: GameOne) {
    Date.now = jest.fn(() => dateNow);
    startGameAndAdvanceCountdown(gameOne);
    advanceCountdown(gameOne, 10000);
    return gameOne;
}

export async function getGameFinishedDataDifferentTimes(gameOne: GameOne, timesFinished?: number[]) {
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
    gameOne = await startAndFinishGameDifferentTimes(gameOne, timesFinished);
    advanceCountdown(gameOne, 10); //call update to check if game has finished and to handle game finished
    return eventData;
}

export async function getGameFinishedDataAllCaughtSameTime(gameOne: GameOne, timesFinished?: number[]) {
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
    gameOne = await startAndAllPlayersCaughtSameTime(gameOne);
    advanceCountdown(gameOne, 10); //call update to check if game has finished and to handle game finished
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
    finishPlayer(gameOne, '1');
    finishPlayer(gameOne, '2');
    finishPlayer(gameOne, '3');
    advanceCountdown(gameOne, 10); //call update to check if game has finished and to handle game finished

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
