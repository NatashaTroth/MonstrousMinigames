import * as React from 'react';

export enum GamePhases {
    counting = 'counting',
    guessing = 'guessing',
    results = 'results',
}

export interface PlayerRank {
    id: string;
    name: string;
    rank: number;
    isActive: boolean;
    points: number;
    previousRank: number;
}

export const defaultValue = {
    playerRanks: [
        {
            id: 'abc',
            name: 'name',
            rank: 0,
            isActive: true,
            points: 0,
            previousRank: 0,
        },
    ],
    setPlayerRanks: () => {
        // do nothing
    },

    phase: GamePhases.counting,
    setPhase: () => {
        // do nothing
    },
    resetGame2: () => {
        // do nothing
    },
};

export type SheepGamePhase = { phase: GamePhases } | undefined;

interface Game2ContextProps {
    playerRanks: PlayerRank[];
    setPlayerRanks: (playerRanks: PlayerRank[]) => void;
    phase: GamePhases;
    setPhase: (val: GamePhases) => void;
    resetGame2: () => void;
}

export const Game2Context = React.createContext<Game2ContextProps>(defaultValue);

const Game2ContextProvider: React.FunctionComponent = ({ children }) => {
    const [phase, setPhase] = React.useState<GamePhases>(defaultValue.phase);
    const [playerRanks, setPlayerRanks] = React.useState<PlayerRank[]>(defaultValue.playerRanks);

    const content = {
        phase,
        setPhase,

        playerRanks,
        setPlayerRanks,

        resetGame2: () => {
            setPhase(defaultValue.phase);
            setPlayerRanks(defaultValue.playerRanks);
        },
    };
    return <Game2Context.Provider value={content}>{children}</Game2Context.Provider>;
};

export default Game2ContextProvider;
