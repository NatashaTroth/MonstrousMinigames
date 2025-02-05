import { GameStateInfo, PlayerRank } from '../interfaces';
import { GameState } from '../../enums';
import {
    GAME_TWO_EVENT_MESSAGE__CHOOSE_RESPONSE,
    GAME_TWO_EVENT_MESSAGE__GUESS_HINT, GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED, GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS,
    GAME_TWO_EVENT_MESSAGE__REMAINING_KILLS
} from '../interfaces/GameTwoEventMessages';
import { GameTwoPlayerRank } from '../interfaces/GameTwoPlayerRank';
import DI from '../../../di';
import {
    GLOBAL_EVENT_MESSAGE__GAME_HAS_FINISHED, GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED, GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
    GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED, GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
    GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED
} from '../../interfaces/GlobalEventMessages';
import { GameNames } from '../../../enums/gameNames';

import { GameTwoMessageEmitter } from './GameTwoMessageEmitter';

export default class GameTwoEventEmitter {
    private static readonly GameTwoMessageEmitter = DI.resolve(GameTwoMessageEmitter);

    public static emitInitialGameStateInfoUpdate(roomId: string, gameState: GameStateInfo) {
        this.GameTwoMessageEmitter.emit({
            type: GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
            roomId,
            data: gameState,
        });
    }

    public static emitPhaseHasChanged(roomId: string, round: number, phase: string) {
        this.GameTwoMessageEmitter.emit({
            type: GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED,
            roomId,
            round,
            phase,
        });
    }

    public static emitPlayerRanks(roomId: string, playerRanks: GameTwoPlayerRank[]) {
        this.GameTwoMessageEmitter.emit({
            type: GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS,
            roomId,
            playerRanks,
        });
    }

    public static emitGuessHint(roomId: string, userId: string, hint: string) {
        this.GameTwoMessageEmitter.emit({
            type: GAME_TWO_EVENT_MESSAGE__GUESS_HINT,
            roomId,
            userId,
            hint,
        });
    }

    public static emitChooseResponse(roomId: string, userId: string, successful: boolean) {
        this.GameTwoMessageEmitter.emit({
            type: GAME_TWO_EVENT_MESSAGE__CHOOSE_RESPONSE,
            roomId,
            userId,
            successful,
        });
    }

    public static emitRemainingKills(roomId: string, userId: string, remainingKills: number) {
        this.GameTwoMessageEmitter.emit({
            type: GAME_TWO_EVENT_MESSAGE__REMAINING_KILLS,
            roomId,
            userId,
            remainingKills,
        });
    }

    public static emitGameHasStartedEvent(roomId: string, countdownTime: number, game: GameNames) {
        this.GameTwoMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
            roomId,
            countdownTime,
            game,
        });
    }

    public static emitGameHasPausedEvent(roomId: string) {
        this.GameTwoMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_PAUSED,
            roomId,
        });
    }

    public static emitGameHasResumedEvent(roomId: string) {
        this.GameTwoMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_RESUMED,
            roomId,
        });
    }

    public static emitGameHasFinishedEvent(roomId: string, gameState: GameState, playerRanks: PlayerRank[]) {
        this.GameTwoMessageEmitter.emit({
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
        this.GameTwoMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STOPPED,
            roomId,
        });
    }

    public static emitPlayerHasDisconnected(roomId: string, userId: string) {
        this.GameTwoMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_DISCONNECTED,
            roomId,
            userId,
        });
    }

    public static emitPlayerHasReconnected(roomId: string, userId: string) {
        this.GameTwoMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__PLAYER_HAS_RECONNECTED,
            roomId,
            userId,
        });
    }
}
