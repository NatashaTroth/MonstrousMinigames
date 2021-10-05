import { GameStateInfo } from './';

export const GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game3/initialGameState';

export const GAME_NUMBER_EVENT_MESSAGES = [GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE];

export interface GameNumberInitialGameState {
    type: typeof GAME_NUMBER_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}
export type GameNumberEventMessage = GameNumberInitialGameState;
