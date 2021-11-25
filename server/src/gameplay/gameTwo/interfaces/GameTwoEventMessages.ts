import { GameStateInfo } from './GameStateInfo';

export const GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game2/initialGameState';
export const GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED = 'game2/PhaseHasChanged';
export const GAME_TWO_EVENT_MESSAGE__GUESS_HINT = 'game2/guessHint';


export const GAME_TWO_EVENT_MESSAGES = [
    GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED,
];

export interface GameTwoInitialGameState {
    type: typeof GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE;
    roomId: string;
    data: GameStateInfo;
}

export interface GameTwoGuessHint {
    type: typeof GAME_TWO_EVENT_MESSAGE__GUESS_HINT;
    roomId: string;
    userId: string;
    hint: string;
}

export interface GameTwoIPhaseHasChanged {
    type: typeof GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED;
    roomId: string;
    round: number;
    phase: string;
}


export type GameTwoEventMessage =
    | GameTwoInitialGameState
    | GameTwoIPhaseHasChanged
    | GameTwoGuessHint;
