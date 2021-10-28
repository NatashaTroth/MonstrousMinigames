import DI from '../../di';
import { GameState } from '../enums';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED
} from '../interfaces/GlobalEventMessages';
import { GameOneEventMessageEmitter } from './GameOneEventMessageEmitter';
import { GameEvents, InitialGameStateInfo, PlayerRank } from './interfaces';
import {
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
    CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS
} from './interfaces/GameOneEventMessages';

export default class GameOneEventEmitter {
    private static readonly catchFoodGameEventMessageEmitter = DI.resolve(GameOneEventMessageEmitter);

    public static emitInitialGameStateInfoUpdate(roomId: string, gameState: InitialGameStateInfo) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameState,
        });
    }

    public static emitStunnablePlayers(roomId: string, stunnablePlayers: string[]) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__STUNNABLE_PLAYERS,
            roomId,
            stunnablePlayers,
        });
    }

    public static emitGameHasStartedEvent(roomId: string, countdownTime: number, game: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
            roomId,
            countdownTime,
            game,
        });
    }

    public static emitGameHasPausedEvent(roomId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
            roomId,
        });
    }

    public static emitGameHasResumedEvent(roomId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
            roomId,
        });
    }

    public static emitObstacleReachedEvent(data: GameEvents.ObstacleReachedInfo) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED,
            roomId: data.roomId,
            userId: data.userId,
            obstacleId: data.obstacleId,
            obstacleType: data.obstacleType,
            numberTrashItems: data.numberTrashItems,
            trashType: data.trashType,
        });
    }

    public static emitObstacleSkippedEvent(data: GameEvents.ObstacleSkippedInfo) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_SKIPPED,
            roomId: data.roomId,
            userId: data.userId,
        });
    }
    public static emitPlayerWantsToSolveObstacle(data: GameEvents.SolveObstacle) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_WILL_BE_SOLVED,
            roomId: data.roomId,
            userId: data.userId,
        });
    }

    public static emitApproachingSolvableObstacleEventOnce(data: GameEvents.ApproachingSolvableObstacle) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE_ONCE,
            roomId: data.roomId,
            userId: data.userId,
            obstacleId: data.obstacleId,
            obstacleType: data.obstacleType,
            distance: data.distance,
        });
    }

    public static emitApproachingSolvableObstacleEvent(data: GameEvents.ApproachingSolvableObstacle) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SOLVABLE_OBSTACLE,
            roomId: data.roomId,
            userId: data.userId,
            obstacleId: data.obstacleId,
            obstacleType: data.obstacleType,
            distance: data.distance,
        });
    }

    public static emitPlayerHasFinishedEvent(roomId: string, userId: string, rank: number) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
            roomId,
            userId,
            rank,
        });
    }

    public static emitPlayerIsDead(roomId: string, userId: string, rank: number) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD,
            roomId,
            userId,
            rank,
        });
    }

    public static emitPlayerIsStunned(roomId: string, userId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
            roomId,
            userId,
        });
    }

    public static emitChasersWerePushed(roomId: string, amount: number) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
            roomId,
            amount,
        });
    }

    public static emitPlayerIsUnstunned(roomId: string, userId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
            roomId,
            userId,
        });
    }

    public static emitGameHasFinishedEvent(roomId: string, gameState: GameState, playerRanks: PlayerRank[]) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
            roomId,
            data: {
                roomId,
                gameState,
                playerRanks,
            },
        });
    }

    public static emitGameHasStoppedEvent(roomId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
            roomId,
        });
    }

    public static emitPlayerHasDisconnected(roomId: string, userId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
            roomId,
            userId,
        });
    }

    public static emitPlayerHasReconnected(roomId: string, userId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED,
            roomId,
            userId,
        });
    }

    public static emitPlayerHasExceededMaxNumberChaserPushes(roomId: string, userId: string) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_EXCEEDED_MAX_NUMBER_CHASER_PUSHES,
            roomId,
            userId,
        });
    }
}
