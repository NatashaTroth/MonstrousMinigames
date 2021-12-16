import * as React from 'react';

export enum GamePhases {
    counting = 'counting',
    guessing = 'guessing',
    results = 'results',
}

export const defaultValue = {
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
    phase: GamePhases;
    setPhase: (val: GamePhases) => void;
    resetGame2: () => void;
}

export const Game2Context = React.createContext<Game2ContextProps>(defaultValue);

const Game2ContextProvider: React.FunctionComponent = ({ children }) => {
    const [phase, setPhase] = React.useState<GamePhases>(defaultValue.phase);

    const content = {
        phase,
        setPhase,

        resetGame2: () => {
            setPhase(defaultValue.phase);
        },
    };
    return <Game2Context.Provider value={content}>{children}</Game2Context.Provider>;
};

export default Game2ContextProvider;
