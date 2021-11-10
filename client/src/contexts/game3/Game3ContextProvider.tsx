import * as React from "react";

import { PhotoUserMapper } from "../../domain/typeGuards/game3/voteForPhotos";
import { VotingResult } from "../../domain/typeGuards/game3/votingResults";

export const defaultValue = {
    roundIdx: 1,
    setRoundIdx: () => {
        // do nothing
    },
    topicMessage: undefined,
    setTopicMessage: () => {
        // do nothing
    },
    photos: [],
    setPhotos: () => {
        // do nothing
    },
    voteForPhotoMessage: undefined,
    setVoteForPhotoMessage: () => {
        // do nothing
    },
    votingResults: undefined,
    setVotingResults: () => {
        // do nothing
    },
    finalRoundCountdownTime: 0,
    setFinalRoundCountdownTime: (val: number) => {
        // do nothing
    },
};

interface Game3ContextProps {
    roundIdx: number;
    setRoundIdx: (val: number) => void;
    topicMessage: { topic: string; countdownTime: number } | undefined;
    setTopicMessage: (topic: { topic: string; countdownTime: number } | undefined) => void;
    photos: string[];
    setPhotos: (photos: string[]) => void;
    voteForPhotoMessage: { photoUrls: PhotoUserMapper[]; countdownTime: number } | undefined;
    setVoteForPhotoMessage: (val: { photoUrls: PhotoUserMapper[]; countdownTime: number } | undefined) => void;
    votingResults: { results: VotingResult[]; countdownTime: number } | undefined;
    setVotingResults: (val: { results: VotingResult[]; countdownTime: number } | undefined) => void;
    finalRoundCountdownTime: number;
    setFinalRoundCountdownTime: (val: number) => void;
}

export const Game3Context = React.createContext<Game3ContextProps>(defaultValue);

const Game3ContextProvider: React.FunctionComponent = ({ children }) => {
    const [roundIdx, setRoundIdx] = React.useState<number>(defaultValue.roundIdx);
    const [topicMessage, setTopicMessage] = React.useState<{ topic: string; countdownTime: number } | undefined>(
        defaultValue.topicMessage
    );
    const [voteForPhotoMessage, setVoteForPhotoMessage] = React.useState<
        | {
              photoUrls: PhotoUserMapper[];
              countdownTime: number;
          }
        | undefined
    >(defaultValue.voteForPhotoMessage);
    const [photos, setPhotos] = React.useState<string[]>([]);
    const [votingResults, setVotingResults] = React.useState<
        | {
              results: VotingResult[];
              countdownTime: number;
          }
        | undefined
    >(defaultValue.voteForPhotoMessage);
    const [finalRoundCountdownTime, setFinalRoundCountdownTime] = React.useState(defaultValue.finalRoundCountdownTime);

    const content = {
        roundIdx,
        setRoundIdx,
        topicMessage,
        setTopicMessage,
        photos,
        setPhotos,
        voteForPhotoMessage,
        setVoteForPhotoMessage,
        votingResults,
        setVotingResults,
        finalRoundCountdownTime,
        setFinalRoundCountdownTime,
    };
    return <Game3Context.Provider value={content}>{children}</Game3Context.Provider>;
};

export default Game3ContextProvider;
