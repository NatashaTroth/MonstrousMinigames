import * as React from 'react';

export const defaultValue = {
    challengeId: 1,
    setChallengeId: () => {
        // do nothing
    },
};

interface Game3ContextProps {
    challengeId: number;
    setChallengeId: (val: number) => void;
}

export const Game3Context = React.createContext<Game3ContextProps>(defaultValue);

const Game3ContextProvider: React.FunctionComponent = ({ children }) => {
    const [challengeId, setChallengeId] = React.useState<number>(1);

    const content = {
        challengeId,
        setChallengeId,
    };
    return <Game3Context.Provider value={content}>{children}</Game3Context.Provider>;
};

export default Game3ContextProvider;
