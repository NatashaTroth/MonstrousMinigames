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

export interface CatchFoodGameObstacleReachedInfo {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED;
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    numberTrashItems?: number;
    trashType?: TrashType;
}

export interface CatchFoodGameObstacleSkippedInfo {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED;
    roomId: string;
    userId: string;
}

export interface CatchFoodGameSolveObstacleInfo {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED;
    roomId: string;
    userId: string;
}
export interface CatchFoodGameApproachingSolvableObstacle {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE;
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    distance: number;
}
export interface CatchFoodGameApproachingSolvableObstacleOnce {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE;
    roomId: string;
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    distance: number;
}
export interface CatchFoodGamePlayerHasFinished {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED;
    roomId: string;
    userId: string;
    rank: number;
}
export interface CatchFoodGameInitialGameState {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}
export interface CatchFoodGameStunnablePlayers {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS;
    roomId: string;
    stunnablePlayers: string[];
}
export interface CatchFoodGamePlayerIsDead {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD;
    roomId: string;
    userId: string;
    rank: number;
}
export interface CatchFoodGamePlayerStunnedState {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED;
    roomId: string;
    userId: string;
}
export interface CatchFoodGamePlayerUnstunnedState {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED;
    roomId: string;
    userId: string;
}
export interface CatchFoodGameChasersWerePushed {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED;
    roomId: string;
    amount: number;
}
export interface CatchFoodGamePlayerHasExceededMaxNumberChaserPushes {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES;
    roomId: string;
    userId: string;
}

export type CatchFoodGameEventMessage =
    | CatchFoodGameObstacleReachedInfo
    | CatchFoodGameObstacleSkippedInfo
    | CatchFoodGameSolveObstacleInfo
    | CatchFoodGameApproachingSolvableObstacle
    | CatchFoodGameApproachingSolvableObstacleOnce
    | CatchFoodGamePlayerHasFinished
    | CatchFoodGameInitialGameState
    | CatchFoodGameStunnablePlayers
    | CatchFoodGamePlayerIsDead
    | CatchFoodGamePlayerStunnedState
    | CatchFoodGamePlayerUnstunnedState
    | CatchFoodGameChasersWerePushed
    | CatchFoodGamePlayerHasExceededMaxNumberChaserPushes;
