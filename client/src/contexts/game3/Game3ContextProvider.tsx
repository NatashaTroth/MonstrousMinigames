import * as React from 'react';
import { photoPhotographerMapper } from '../../domain/typeGuards/game3/voteForPhotos';


export const defaultValue = {
    challengeId: 1,
    setChallengeId: () => {
        // do nothing
    },
    topicMessage: {topic: '', countdownTime: -1},
    setTopicMessage: () => {
        // do nothing
    },
    timeIsUp: false,
    setTimeIsUp: () => {
        // do nothing
    },
    photos: [],
    setPhotos: () => {
        // do nothing
    }
};

interface Game3ContextProps {
    challengeId: number;
    setChallengeId: (val: number) => void;
    topicMessage: {topic: string, countdownTime: number};
    setTopicMessage: (topic: {topic: string, countdownTime: number}) => void;
    timeIsUp: boolean;
    setTimeIsUp: (val: boolean) => void;
    photos: string[];
    setPhotos: (photos: string[]) => void;
}

export const Game3Context = React.createContext<Game3ContextProps>(defaultValue);

const Game3ContextProvider: React.FunctionComponent = ({ children }) => {
    const [challengeId, setChallengeId] = React.useState<number>(1);
    const [topicMessage, setTopicMessage] = React.useState({topic: '', countdownTime: -1});
    const [photos, setPhotos] = React.useState<string[]>([]);
    const [timeIsUp, setTimeIsUp] = React.useState(false);

    const content = {
        challengeId,
        setChallengeId,
        topicMessage,
        setTopicMessage,
        timeIsUp,
        setTimeIsUp,
        photos,
        setPhotos,
    };
    return <Game3Context.Provider value={content}>{children}</Game3Context.Provider>;
};

export default Game3ContextProvider;