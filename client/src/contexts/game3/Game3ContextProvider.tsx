import * as React from 'react';

import { GameContext } from '../GameContextProvider';

export const defaultValue = {
    challengeId: 1,
    setChallengeId: () => {
        // do nothing
    },
    topicMessage: '',
    setTopicMessage: () => {
        // do nothing
    },
};

interface Game3ContextProps {
    challengeId: number;
    setChallengeId: (val: number) => void;
    topicMessage: string;
    setTopicMessage: (topic: string) => void;
}

export const Game3Context = React.createContext<Game3ContextProps>(defaultValue);

const Game3ContextProvider: React.FunctionComponent = ({ children }) => {
    const [challengeId, setChallengeId] = React.useState<number>(1);
    const { topicMessage, setTopicMessage } = React.useContext(GameContext);

    const content = {
        challengeId,
        setChallengeId,
        topicMessage,
        setTopicMessage,
    };
    return <Game3Context.Provider value={content}>{children}</Game3Context.Provider>;
};

export default Game3ContextProvider;
