//TODO Events/Messages 2

import DI from '../../di';
import { GameState } from '../enums';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED
} from '../interfaces/GlobalEventMessages';
import { GameThreeEventMessageEmitter } from './GameThreeEventMessageEmitter';
import { InitialGameStateInfo, PlayerRank } from './interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER
} from './interfaces/GameThreeEventMessages';

// params: (data: GameEvents.ObstacleReachedInfo

export default class GameThreeEventEmitter {
    private static readonly GameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);

    public static emitInitialGameStateInfoUpdate(roomId: string, gameState: InitialGameStateInfo) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameState,
        });
    }

    public static emitGameHasStartedEvent(roomId: string, countdownTime: number) {
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
            roomId,
            countdownTime,
        });
    }

    public static emitGameHasPausedEvent(roomId: string) {
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
            roomId,
        });
    }

    public static emitGameHasResumedEvent(roomId: string) {
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
            roomId,
        });
    }

    public static emitGameHasFinishedEvent(roomId: string, gameState: GameState, playerRanks: PlayerRank[]) {
        this.GameThreeEventMessageEmitter.emit({
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
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
            roomId,
        });
    }

    public static emitPlayerHasDisconnected(roomId: string, userId: string) {
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
            roomId,
            userId,
        });
    }

    public static emitPlayerHasReconnected(roomId: string, userId: string) {
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED,
            roomId,
            userId,
        });
    }
    // ----------------------------- Game Specific: -------------------------------

    public static emitNewTopic(roomId: string, topic: string, countdownTime: number) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC,
            roomId,
            topic,
            countdownTime,
        });
    }

    public static emitTakePhotoCountdownOver(roomId: string) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
            roomId,
        });
    }
}
