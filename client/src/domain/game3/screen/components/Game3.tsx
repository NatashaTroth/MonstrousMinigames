import React from "react";

import Countdown from "../../../../components/common/Countdown";
import { MyAudioContext, Sound } from "../../../../contexts/AudioContextProvider";
import {
    FinalPhoto, Game3Context, Topic, Vote, VoteResult
} from "../../../../contexts/game3/Game3ContextProvider";
import { GameContext } from "../../../../contexts/GameContextProvider";
import {
    ImagesContainer, InstructionContainer, PictureInstruction, RandomWord, ScreenContainer
} from "./Game.sc";
import Photo from "./Photo";

const Game3: React.FunctionComponent = () => {
    const { countdownTime } = React.useContext(GameContext);
    const {
        roundIdx,
        voteForPhotoMessage,
        votingResults,
        finalRoundCountdownTime,
        presentFinalPhotos,
        topicMessage,
        finalRoundPhotoTopics,
    } = React.useContext(Game3Context);
    const [displayCountdown, setDisplayCountdown] = React.useState(true);
    const [timeToDisplay, setTimeToDisplay] = React.useState<undefined | number>(undefined);
    const { changeSound, setVolume, isPlaying, volume } = React.useContext(MyAudioContext);
    const finalRound = roundIdx === 3;

    React.useEffect(() => {
        changeSound(Sound.game3);
        localStorage.setItem('beforeVolume', String(volume));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (finalRound && presentFinalPhotos && isPlaying) {
            setVolume(0.05);
        }
    }, [finalRound, isPlaying, presentFinalPhotos, setVolume, voteForPhotoMessage]);

    React.useEffect(() => {
        if (finalRound && voteForPhotoMessage && isPlaying) {
            const beforeVolume = localStorage.getItem('beforeVolume');
            setVolume(Number(beforeVolume));
        }
    }, [finalRound, isPlaying, setVolume, voteForPhotoMessage]);

    React.useEffect(() => {
        setDisplayCountdown(true);
    }, [roundIdx]);

    React.useEffect(() => {
        const time = getTime(presentFinalPhotos, finalRoundCountdownTime, voteForPhotoMessage, topicMessage);
        setTimeToDisplay(time);
    }, [presentFinalPhotos, finalRoundCountdownTime, voteForPhotoMessage, topicMessage]);

    return (
        <ScreenContainer>
            <PictureInstruction size={voteForPhotoMessage ? 'small' : 'default'}>
                {finalRound ? 'Final Round' : `Round ${roundIdx}`}
            </PictureInstruction>
            {!displayCountdown && timeToDisplay && !votingResults && (
                <Countdown
                    time={timeToDisplay}
                    size="small"
                    keyValue={`${presentFinalPhotos?.photographerId}${timeToDisplay}`}
                />
            )}
            {displayCountdown ? (
                <Countdown
                    time={countdownTime}
                    onComplete={() => {
                        setDisplayCountdown(false);
                    }}
                />
            ) : (
                <>
                    <InstructionContainer>
                        {getInstruction(
                            presentFinalPhotos,
                            voteForPhotoMessage,
                            finalRound,
                            votingResults,
                            topicMessage?.topic
                        )}
                        {finalRound && (
                            <RandomWord size={voteForPhotoMessage || presentFinalPhotos ? 'small' : 'default'}>
                                {finalRoundPhotoTopics.join(', ')}
                            </RandomWord>
                        )}
                    </InstructionContainer>
                    {voteForPhotoMessage && (
                        <ImagesContainer>
                            {voteForPhotoMessage.photoUrls?.map((photo, index) => (
                                <Photo
                                    key={`image${index}`}
                                    id={photo.photoId}
                                    url={photo.url}
                                    votingResult={
                                        votingResults?.results.find(
                                            result => result.photographerId === photo.photographerId
                                        )?.votes
                                    }
                                />
                            ))}
                        </ImagesContainer>
                    )}
                    {presentFinalPhotos && (
                        <ImagesContainer>
                            {presentFinalPhotos.photoUrls?.map((photo, index) => (
                                <Photo key={`finalResultimage${index}`} url={photo} />
                            ))}
                        </ImagesContainer>
                    )}
                </>
            )}
        </ScreenContainer>
    );
};
export default Game3;

export function getInstruction(
    presentFinalPhotos: FinalPhoto,
    voteForPhotoMessage: Vote,
    finalRound: boolean,
    votingResults: VoteResult,
    topic: string | undefined
) {
    let instruction = 'Take a picture that represents the word';

    if (finalRound) {
        instruction =
            'Get inspired by the topics and take three photos. Later you will receive random photos from all uploaded photos. Use your imagination and present a short story about it containing one of the topics.';
    }

    if (voteForPhotoMessage) {
        instruction = finalRound
            ? 'Vote on your smartphone for the story that you liked the most'
            : 'Vote on your smartphone for the picture that looks most like';
    }

    if (votingResults) {
        instruction = 'Results for this round';
    }

    if (presentFinalPhotos) {
        instruction = `${presentFinalPhotos.name} - Tell us a story about the pictures on the screen`;
    }

    return (
        <>
            <PictureInstruction size={voteForPhotoMessage ? 'small' : 'default'}>{instruction}</PictureInstruction>
            {!presentFinalPhotos && !finalRound && (
                <RandomWord size={voteForPhotoMessage ? 'small' : 'default'}>{topic}</RandomWord>
            )}
        </>
    );
}

export function getTime(
    presentFinalPhotos: FinalPhoto,
    finalRoundCountdownTime: number | undefined,
    voteForPhotoMessage: Vote,
    topicMessage: Topic
) {
    if (voteForPhotoMessage) return voteForPhotoMessage.countdownTime;
    else if (presentFinalPhotos) return presentFinalPhotos.countdownTime;
    else if (finalRoundCountdownTime) return finalRoundCountdownTime;
    else if (topicMessage) return topicMessage.countdownTime;

    return undefined;
}
