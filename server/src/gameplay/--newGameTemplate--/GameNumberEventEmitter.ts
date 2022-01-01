import DI from '../../di';
import { GameNames } from '../../enums/gameNames';
import { GameState } from '../enums';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED
} from '../interfaces/GlobalEventMessages';
import { GameNumberEventMessageEmitter } from './GameNumberEventMessageEmitter';
import { InitialGameStateInfo, PlayerRank } from './interfaces';
import {
    GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE
} from './interfaces/GameNumberEventMessages';

// params: (data: GameEvents.ObstacleReachedInfo

export default class GameNumberEventEmitter {
    private static readonly GameNumberEventMessageEmitter = DI.resolve(GameNumberEventMessageEmitter);

    public static emitInitialGameStateInfoUpdate(roomId: string, gameState: InitialGameStateInfo) {
        this.GameNumberEventMessageEmitter.emit({
            type: GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameState,
        });
    }

    public static emitGameHasStartedEvent(roomId: string, countdownTime: number, game: GameNames) {
        this.GameNumberEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
            roomId,
            countdownTime,
            game,
        });
    }

    public static emitGameHasPausedEvent(roomId: string) {
        this.GameNumberEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
            roomId,
        });
    }

    public static emitGameHasResumedEvent(roomId: string) {
        this.GameNumberEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
            roomId,
        });
    }

    public static emitGameHasFinishedEvent(roomId: string, gameState: GameState, playerRanks: PlayerRank[]) {
        this.GameNumberEventMessageEmitter.emit({
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
        this.GameNumberEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
            roomId,
        });
    }

    public static emitPlayerHasDisconnected(roomId: string, userId: string) {
        this.GameNumberEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
            roomId,
            userId,
        });
    }

    public static emitPlayerHasReconnected(roomId: string, userId: string) {
        this.GameNumberEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED,
            roomId,
            userId,
        });
    }
}
