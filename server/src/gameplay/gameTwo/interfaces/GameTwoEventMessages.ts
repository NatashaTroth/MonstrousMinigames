import { GameStateInfo } from './GameStateInfo';

export const GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game2/initialGameState';


export const GAME_TWO_EVENT_MESSAGES = [
    GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
];

export interface GameTwoInitialGameState {
    type: typeof GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}


export type GameTwoEventMessage =
    | GameTwoInitialGameState;
