import DI from '../../di';
import { GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED, GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED } from '../interfaces/GlobalEventMessages';
import { CatchFoodGameEventMessageEmitter } from './CatchFoodGameEventMessageEmitter';
import { GameEvents } from './interfaces';
import { CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SKIPPABLE_OBSTACLE, CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED, CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE, CATCH_FOOD_GAME_EVENT_MESSAGE__OBSTACLE_REACHED, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED, CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED } from './interfaces/CatchFoodGameEventMessages';

export default class CatchFoodGameEventEmitter {
    private static readonly catchFoodGameEventMessageEmitter = DI.resolve(CatchFoodGameEventMessageEmitter);

    public static emitInitialGameStateInfoUpdate(data: GameEvents.InitialGameStateInfoUpdate) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId: data.roomId,
            data: data.gameStateInfo,
        });
    }

    public static emitGameHasStartedEvent(data: GameEvents.GameHasStarted) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
            roomId: data.roomId,
            countdownTime: data.countdownTime,
        });
    }

    public static emitGameHasPausedEvent(data: GameEvents.GameStateHasChanged) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
            roomId: data.roomId,
        });
    }

    public static emitGameHasResumedEvent(data: GameEvents.GameStateHasChanged) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
            roomId: data.roomId,
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

    public static emitApproachingSkippableObstacleEvent(data: GameEvents.ApproachingSkippableObstacle) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__APPROACHING_SKIPPABLE_OBSTACLE,
            roomId: data.roomId,
            userId: data.userId,
            obstacleId: data.obstacleId,
            obstacleType: data.obstacleType,
            distance: data.distance,
        });
    }

    public static emitPlayerHasFinishedEvent(data: GameEvents.PlayerHasFinished) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_HAS_FINISHED,
            roomId: data.roomId,
            userId: data.userId,
            rank: data.rank,
        });
    }

    public static emitPlayerIsDead(data: GameEvents.PlayerIsDead) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_DEAD,
            roomId: data.roomId,
            userId: data.userId,
            rank: data.rank,
        });
    }

    public static emitPlayerIsStunned(data: GameEvents.PlayerStunnedState) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_STUNNED,
            roomId: data.roomId,
            userId: data.userId,
        });
    }

    public static emitChasersWerePushed(data: GameEvents.ChasersWerePushed) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__CHASERS_WERE_PUSHED,
            roomId: data.roomId,
            amount: data.amount,
        });
    }

    public static emitPlayerIsUnstunned(data: GameEvents.PlayerStunnedState) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: CATCH_FOOD_GAME_EVENT_MESSAGE__PLAYER_IS_UNSTUNNED,
            roomId: data.roomId,
            userId: data.userId,
        });
    }

    public static emitGameHasFinishedEvent(data: GameEvents.GameHasFinished) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED,
            roomId: data.roomId,
            data: {
                roomId: data.roomId,
                gameState: data.gameState,
                playerRanks: data.playerRanks,
            },
        });
    }

    public static emitGameHasStoppedEvent(data: GameEvents.GameStateHasChanged) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
            roomId: data.roomId,
        });
    }

    public static emitPlayerHasDisconnected(data: GameEvents.PlayerHasDisconnectedInfo) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
            roomId: data.roomId,
            userId: data.userId,
        });
    }

    public static emitPlayerHasReconnected(data: GameEvents.PlayerHasReconnectedInfo) {
        this.catchFoodGameEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED,
            roomId: data.roomId,
            userId: data.userId,
        });
    }
}
