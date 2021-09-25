import { GameStateInfo } from ".";
import { ObstacleType, TrashType } from "../enums";

export const CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED = 'game1/obstacle';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE = 'game1/approachingSolvableObstacle';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED = 'game1/playerFinished';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game1/initialGameState';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD = 'game1/playerDied';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED = 'game1/playerStunned';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED = 'game1/playerUnstunned';
export const CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED = 'game1/chasersPushed';

export const CATCH_FOOD_GAME_EVENT_MESSAGES = [
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
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
export interface CatchFoodGameApproachingSolvableObstacle {
    type: typeof CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE;
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

export type CatchFoodGameEventMessage =
    CatchFoodGameObstacleReachedInfo
    | CatchFoodGameApproachingSolvableObstacle
    | CatchFoodGamePlayerHasFinished
    | CatchFoodGameInitialGameState
    | CatchFoodGamePlayerIsDead
    | CatchFoodGamePlayerStunnedState
    | CatchFoodGamePlayerUnstunnedState
    | CatchFoodGameChasersWerePushed;
