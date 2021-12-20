import { GameStateInfo } from './GameStateInfo';
import { GameTwoPlayerRank } from './GameTwoPlayerRank';

export const GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE = 'game2/initialGameState';
export const GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED = 'game2/PhaseHasChanged';
export const GAME_TWO_EVENT_MESSAGE__GUESS_HINT = 'game2/guessHint';
export const GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS = 'game2/playerRanks';

export const GAME_TWO_EVENT_MESSAGES = [
    GAME_TWO_EVENT_MESSAGE__INITIAL_GAME_STATE_INFO_UPDATE,
    GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED,
    GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS,
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

export interface GameTwoPlayerRanks {
    type: typeof GAME_TWO_EVENT_MESSAGE__PLAYER_RANKS;
    roomId: string;
    playerRanks: GameTwoPlayerRank[];
}

export interface GameTwoPhaseHasChanged {
    type: typeof GAME_TWO_EVENT_MESSAGE__PHASE_HAS_CHANGED;
    roomId: string;
    round: number;
    phase: string;
}


export type GameTwoEventMessage =
    | GameTwoInitialGameState
    | GameTwoPhaseHasChanged
    | GameTwoGuessHint
    | GameTwoPlayerRanks;
