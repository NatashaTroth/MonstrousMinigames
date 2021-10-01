//TODO Events/Messages 1

import { GameStateInfo } from './';

export const GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game3/initialGameState';
export const GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC = 'game3/newPhotoTopic';
export const GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER = 'game3/takePhotoCountdownOver';
export const GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS = 'game3/voteForPhotos';

export const GAME_THREE_EVENT_MESSAGES = [
    GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_THREE_EVENT_MESSAGE__NEW_PHOTO_TOPIC,
    GAME_THREE_EVENT_MESSAGE__TAKE_PHOTO_COUNTDOWN_OVER,
    GAME_THREE_EVENT_MESSAGE__VOTE_FOR_PHOTOS,
];

export interface GameThreeInitialGameState {
    type: typeof GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
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
    photoUrls: string[];
    countdownTime: number;
}
export type GameThreeEventMessage =
    | GameThreeInitialGameState
    | NewPhotoTopicInfo
    | TakePhotoCountdownOver
    | VoteForPhotos;
