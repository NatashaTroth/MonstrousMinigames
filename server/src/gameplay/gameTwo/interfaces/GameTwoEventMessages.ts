import { GameStateInfo } from './GameStateInfo';

export const GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game2/initialGameState';
export const GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED = 'game2/PhaseHasChanged';


export const GAME_TWO_EVENT_MESSAGES = [
    GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED,
];

export interface GameTwoInitialGameState {
    type: typeof GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}

export interface GameTwoIPhaseHasChanged {
    type: typeof GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED;
    roomId: string;
    round: number;
    phase: string;
}


export type GameTwoEventMessage =
    | GameTwoInitialGameState
    | GameTwoIPhaseHasChanged;
