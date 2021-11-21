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
import {
    PhotoPhotographerMapper, PlayerNameId, PlayerRank, VotesPhotographerMapper
} from './interfaces';
import {
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC, GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS, GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
    GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS, GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS
} from './interfaces/GameThreeEventMessages';

// params: (data: GameEvents.ObstacleReachedInfo

export default class GameThreeEventEmitter {
    private static readonly GameThreeEventMessageEmitter = DI.resolve(GameThreeEventMessageEmitter);

    //TODO is this used?
    // public static emitInitialGameStateInfoUpdate(roomId: string, gameState: InitialGameStateInfo) {
    //     this.GameThreeEventMessageEmitter.emit({
    //         type: GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    //         roomId,
    //         data: gameState,
    //     });
    // }

    public static emitGameHasStartedEvent(roomId: string, countdownTime: number, game: string) {
        this.GameThreeEventMessageEmitter.emit({
            type: GLOBAL_EVENT_MESSAGE__GAME_HAS_STARTED,
            roomId,
            countdownTime,
            game,
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

    public static emitNewRound(roomId: string, roundIdx: number) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
            roomId,
            roundIdx,
        });
    }

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

    public static emitVoteForPhotos(roomId: string, photoUrls: PhotoPhotographerMapper[], countdownTime: number) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
            roomId,
            photoUrls,
            countdownTime,
        });
    }

    public static emitPhotoVotingResults(roomId: string, results: VotesPhotographerMapper[], countdownTime: number) {
        // console.log('Emitting Photo Voting Resutls');
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS,
            roomId,
            results,
            countdownTime,
        });
    }

    public static emitTakeFinalPhotosCountdown(roomId: string, countdownTime: number) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
            roomId,
            countdownTime,
        });
    }

    public static emitPresentFinalPhotosCountdown(
        roomId: string,
        countdownTime: number,
        nextPresenter: PlayerNameId,
        photoUrls: string[]
    ) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
            roomId,
            countdownTime,
            photographerId: nextPresenter.id,
            name: nextPresenter.name,
            photoUrls,
        });
    }

    public static emitVoteForFinalPhotos(roomId: string, countdownTime: number, photographers: PlayerNameId[]) {
        this.GameThreeEventMessageEmitter.emit({
            type: GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS,
            roomId,
            countdownTime,
            photographers,
        });
    }
}
