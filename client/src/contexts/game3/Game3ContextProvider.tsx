import * as React from "react";

import { Photographer } from "../../domain/typeGuards/game3/voteForFinalPhotos";
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
    finalRoundCountdownTime: undefined,
    setFinalRoundCountdownTime: () => {
        // do nothing
    },
    presentFinalPhotos: undefined,
    setPresentFinalPhotos: () => {
        // do nothing
    },
    resetGame3: () => {
        // do nothing
    },
};

export type VoteResult = { results: VotingResult[]; countdownTime: number } | undefined;
export type Topic = { topic: string; countdownTime: number } | undefined;
export type Vote = { photoUrls?: PhotoUserMapper[]; photographers?: Photographer[]; countdownTime: number } | undefined;
export type FinalPhoto =
    | { photographerId: string; photoUrls: string[]; countdownTime: number; name: string }
    | undefined;

interface Game3ContextProps {
    roundIdx: number;
    setRoundIdx: (val: number) => void;
    topicMessage: Topic;
    setTopicMessage: (topic: Topic) => void;
    photos: string[];
    setPhotos: (photos: string[]) => void;
    voteForPhotoMessage: Vote;
    setVoteForPhotoMessage: (val: Vote) => void;
    votingResults: VoteResult;
    setVotingResults: (val: VoteResult) => void;
    finalRoundCountdownTime: number | undefined;
    setFinalRoundCountdownTime: (val: number) => void;
    presentFinalPhotos: FinalPhoto;
    setPresentFinalPhotos: (val: FinalPhoto) => void;
    resetGame3: () => void;
}

export const Game3Context = React.createContext<Game3ContextProps>(defaultValue);

const Game3ContextProvider: React.FunctionComponent = ({ children }) => {
    const [roundIdx, setRoundIdx] = React.useState<number>(defaultValue.roundIdx);
    const [topicMessage, setTopicMessage] = React.useState<Topic>(defaultValue.topicMessage);
    const [voteForPhotoMessage, setVoteForPhotoMessage] = React.useState<Vote>(defaultValue.voteForPhotoMessage);
    const [photos, setPhotos] = React.useState<string[]>([]);
    const [votingResults, setVotingResults] = React.useState<VoteResult>(defaultValue.voteForPhotoMessage);
    const [finalRoundCountdownTime, setFinalRoundCountdownTime] = React.useState<number | undefined>(
        defaultValue.finalRoundCountdownTime
    );
    const [presentFinalPhotos, setPresentFinalPhotos] = React.useState<FinalPhoto>(defaultValue.presentFinalPhotos);

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
        presentFinalPhotos,
        setPresentFinalPhotos,
        resetGame3: () => {
            setRoundIdx(defaultValue.roundIdx);
            setTopicMessage(defaultValue.topicMessage);
            setVoteForPhotoMessage(defaultValue.voteForPhotoMessage);
            setPhotos([]);
            setVotingResults(defaultValue.voteForPhotoMessage);
            setFinalRoundCountdownTime(defaultValue.finalRoundCountdownTime);
            setPresentFinalPhotos(defaultValue.presentFinalPhotos);
        },
    };
    return <Game3Context.Provider value={content}>{children}</Game3Context.Provider>;
};

export default Game3ContextProvider;
