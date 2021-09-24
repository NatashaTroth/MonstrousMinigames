import { GameState } from "../enums";

export const GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED = 'game1/hasStarted';
export const GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED = 'gameHasFinished';
export const GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED = 'gameHasStopped';
export const GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED = 'gameHasPaused';
export const GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED = 'gameHasResumed';
export const GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED = 'playerHasDisconnected';
export const GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED = 'playerHasReconnected';

export const GLOBAL_EVENT_MESSAGES = [
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED,
];

export interface GlobalGameHasStarted {
    type: typeof GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED;
    roomId: string;
    countdownTime: number;
}
export interface GlobalGameHasFinished {
    type: typeof GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED;
    roomId: string;
    data: {
        roomId: string;
        gameState: GameState;
        playerRanks?: any[];
    };
}
export interface GlobalGameHasStopped {
    type: typeof GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED;
    roomId: string;
}
export interface GlobalGameHasPaused {
    type: typeof GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED;
    roomId: string;
}
export interface GlobalGameHasResumed {
    type: typeof GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED;
    roomId: string;
}
export interface GlobalPlayerHasDisconnected {
    type: typeof GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED;
    roomId: string;
    userId: string;
}
export interface GlobalPlayerHasReconnected {
    type: typeof GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED;
    roomId: string;
    userId: string;
}

export type GlobalEventMessage =
    GlobalGameHasStarted
    | GlobalGameHasFinished
    | GlobalGameHasStopped
    | GlobalGameHasPaused
    | GlobalGameHasResumed
    | GlobalPlayerHasDisconnected
    | GlobalPlayerHasReconnected;
