import { ObstacleType, TrashType } from '../enums';
import { GameStateInfo } from './';

export const CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED = 'game1/obstacle';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED = 'game1/obstacleSkipped';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED = 'game1/obstacleWillBeSolved';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE = 'game1/approachingSolvableObstacle';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE =
    'game1/approachingSolvableObstacleOnce';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED = 'game1/playerFinished';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game1/initialGameState';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS = 'game1/stunnablePlayers';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD = 'game1/playerDied';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED = 'game1/playerStunned';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED = 'game1/playerUnstunned';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED = 'game1/chasersPushed';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES =
    'game1/playerHasExceededMaxNumberChaserPushes';

export const CATCH_FOOD_GAME_EVENT_MESSAGES = [
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
];

export interface GameOneObstacleReachedInfo {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED;
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    numberTrashItems?: number;
    trashType?: TrashType;
}

export interface GameOneObstacleSkippedInfo {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED;
    roomId: string;
    userId: string;
}

export interface GameOneSolveObstacleInfo {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED;
    roomId: string;
    userId: string;
}
export interface GameOneApproachingSolvableObstacle {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE;
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    distance: number;
}
export interface GameOneApproachingSolvableObstacleOnce {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE;
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    distance: number;
}
export interface GameOnePlayerHasFinished {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED;
    roomId: string;
    userId: string;
    rank: number;
}
export interface GameOneInitialGameState {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}
export interface GameOneStunnablePlayers {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS;
    roomId: string;
    stunnablePlayers: string[];
}
export interface GameOnePlayerIsDead {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD;
    roomId: string;
    userId: string;
    rank: number;
}
export interface GameOnePlayerStunnedState {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED;
    roomId: string;
    userId: string;
}
export interface GameOnePlayerUnstunnedState {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED;
    roomId: string;
    userId: string;
}
export interface GameOneChasersWerePushed {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED;
    roomId: string;
    amount: number;
}
export interface GameOnePlayerHasExceededMaxNumberChaserPushes {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES;
    roomId: string;
    userId: string;
}

export type GameOneEventMessage =
    | GameOneObstacleReachedInfo
    | GameOneObstacleSkippedInfo
    | GameOneSolveObstacleInfo
    | GameOneApproachingSolvableObstacle
    | GameOneApproachingSolvableObstacleOnce
    | GameOnePlayerHasFinished
    | GameOneInitialGameState
    | GameOneStunnablePlayers
    | GameOnePlayerIsDead
    | GameOnePlayerStunnedState
    | GameOnePlayerUnstunnedState
    | GameOneChasersWerePushed
    | GameOnePlayerHasExceededMaxNumberChaserPushes;
