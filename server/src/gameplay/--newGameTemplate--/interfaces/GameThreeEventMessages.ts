import { GameStateInfo } from './';

export const GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game3/initialGameState';

export const GAME_THREE_EVENT_MESSAGES = [GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE];

export interface GameThreeInitialGameState {
    type: typeof GAME_THREE_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}
export type GameThreeEventMessage = GameThreeInitialGameState;
