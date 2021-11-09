import * as React from 'react';

import { photoPhotographerMapper } from '../../domain/typeGuards/game3/voteForPhotos';

export const defaultValue = {
    roundIdx: 1,
    setRoundIdx: () => {
        // do nothing
    },
    topicMessage: { topic: '', countdownTime: -1 },
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
    },
    voteForPhotoMessage: { photoUrls: [], countdownTime: -1 },
    setVoteForPhotoMessage: () => {
        // do nothing
    },
};

interface Game3ContextProps {
    roundIdx: number;
    setRoundIdx: (val: number) => void;
    topicMessage: { topic: string; countdownTime: number };
    setTopicMessage: (topic: { topic: string; countdownTime: number }) => void;
    timeIsUp: boolean;
    setTimeIsUp: (val: boolean) => void;
    photos: string[];
    setPhotos: (photos: string[]) => void;
    voteForPhotoMessage: { photoUrls: photoPhotographerMapper[]; countdownTime: number };
    setVoteForPhotoMessage: (val: { photoUrls: photoPhotographerMapper[]; countdownTime: number }) => void;
}

export const Game3Context = React.createContext<Game3ContextProps>(defaultValue);

const Game3ContextProvider: React.FunctionComponent = ({ children }) => {
    const [roundIdx, setRoundIdx] = React.useState<number>(1);
    const [topicMessage, setTopicMessage] = React.useState({ topic: '', countdownTime: -1 });
    const [voteForPhotoMessage, setVoteForPhotoMessage] = React.useState({
        photoUrls: [] as photoPhotographerMapper[],
        countdownTime: -1,
    });
    const [photos, setPhotos] = React.useState<string[]>([]);
    const [timeIsUp, setTimeIsUp] = React.useState(false);

    const content = {
        roundIdx,
        setRoundIdx,
        topicMessage,
        setTopicMessage,
        timeIsUp,
        setTimeIsUp,
        photos,
        setPhotos,
        voteForPhotoMessage,
        setVoteForPhotoMessage,
    };
    return <Game3Context.Provider value={content}>{children}</Game3Context.Provider>;
};

export default Game3ContextProvider;
