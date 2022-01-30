import { PhotoPhotographerMapper, PlayerNameId, VotesPhotographerMapper } from './';
import { GameThreePlayerRank } from './GameThreePlayerRank';

export const GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game3/initialGameState';
export const GAME_THREE_EVENT_MESSAGE__NEW_ROUND = 'game3/newRound';
export const GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC = 'game3/newPhotoTopic';
export const GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER = 'game3/takePhotoCountdownOver';
export const GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS = 'game3/voteForPhotos';
export const GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS = 'game3/photoVotingResults';
export const GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN = 'game3/takeFinalPhotosCountdown';
export const GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS = 'game3/presentFinalPhotos';
export const GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS = 'game3/voteForFinalPhotos';
export const GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS = 'game3/finalResults';

export const GAME_THREE_EVENT_MESSAGES = [
    GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_THREE_EVENT_MESSAGE__NEW_ROUND,
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC,
    GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS,
    GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN,
    GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS,
    GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS,
];

// export interface GameThreeInitialGameState {
//     type: typeof GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
//     roomId: string;
//     data: GameStateInfo;
// }
export interface GameThreeNewRound {
    type: typeof GAME_THREE_EVENT_MESSAGE__NEW_ROUND;
    roomId: string;
    roundIdx: number;
}

export interface NewPhotoTopicInfo {
    type: typeof GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC;
    roomId: string;
    topic: string;
    countdownTime: number; //ms
}

export interface TakePhotoCountdownOver {
    type: typeof GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER;
    roomId: string;
}

export interface VoteForPhotos {
    type: typeof GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS;
    roomId: string;
    photoUrls: PhotoPhotographerMapper[];
    countdownTime: number;
}

export interface PhotoVotingResults {
    type: typeof GAME_THREE_EVENT_MESSAGE__PHOTO_VOTING_RESULTS;
    roomId: string;
    results: VotesPhotographerMapper[];
    countdownTime: number;
}

export interface TakeFinalPhotosCountdown {
    type: typeof GAME_THREE_EVENT_MESSAGE__TAKE_FINAL_PHOTOS_COUNTDOWN;
    roomId: string;
    countdownTime: number;
    photoTopics: string[];
}

export interface PresentFinalPhotos {
    type: typeof GAME_THREE_EVENT_MESSAGE__PRESENT_FINAL_PHOTOS;
    roomId: string;
    countdownTime: number;
    photographerId: string;
    name: string;
    photoUrls: string[];
}
export interface VoteForFinalPhotos {
    type: typeof GAME_THREE_EVENT_MESSAGE__VOTE_FOR_FINAL_PHOTOS;
    roomId: string;
    countdownTime: number;
    photographers: PlayerNameId[];
}
export interface ViewingFinalPhotos {
    type: typeof GAME_THREE_EVENT_MESSAGE__VIEWING_FINAL_PHOTOS;
    roomId: string;
    results: GameThreePlayerRank[];
}

export type GameThreeEventMessage =
    // | GameThreeInitialGameState
    | GameThreeNewRound
    | NewPhotoTopicInfo
    | TakePhotoCountdownOver
    | VoteForPhotos
    | PhotoVotingResults
    | TakeFinalPhotosCountdown
    | PresentFinalPhotos
    | VoteForFinalPhotos
    | ViewingFinalPhotos;
