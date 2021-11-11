import React from "react";

import Countdown from "../../../../components/common/Countdown";
import { Game3Context } from "../../../../contexts/game3/Game3ContextProvider";
import { GameContext } from "../../../../contexts/GameContextProvider";
import {
    Frame, ImageContainer, ImagesContainer, InstructionContainer, PictureInstruction, RandomWord,
    ScreenContainer, StyledChip, StyledImg
} from "./Game.sc";

const Game3: React.FunctionComponent = () => {
    const { countdownTime } = React.useContext(GameContext);
    const {
        roundIdx,
        voteForPhotoMessage,
        votingResults,
        finalRoundCountdownTime,
        presentFinalPhotos,
    } = React.useContext(Game3Context);
    const [displayCountdown, setDisplayCountdown] = React.useState(true);
    const [timeToDisplay, setTimeToDisplay] = React.useState(0);
    const { topicMessage } = React.useContext(Game3Context);
    const finalRound = roundIdx === 3;

    React.useEffect(() => {
        setDisplayCountdown(true);
    }, [roundIdx]);

    React.useEffect(() => {
        const time = presentFinalPhotos
            ? presentFinalPhotos.countdownTime
            : finalRoundCountdownTime
            ? finalRoundCountdownTime
            : voteForPhotoMessage
            ? voteForPhotoMessage.countdownTime
            : topicMessage
            ? topicMessage.countdownTime
            : 0;

        // eslint-disable-next-line no-console
        console.log(time);
        setTimeToDisplay(time);
    }, [presentFinalPhotos, finalRoundCountdownTime, voteForPhotoMessage, topicMessage]);

    return (
        <ScreenContainer>
            <PictureInstruction>{finalRound ? 'Final Round' : `Round ${roundIdx}`}</PictureInstruction>
            {!displayCountdown && !voteForPhotoMessage && topicMessage && <Countdown time={timeToDisplay} />}
            {displayCountdown ? (
                <>
                    <Countdown
                        time={countdownTime}
                        onComplete={() => {
                            setDisplayCountdown(false);
                        }}
                    />
                </>
            ) : (
                <>
                    <InstructionContainer>
                        {presentFinalPhotos ? (
                            <PictureInstruction>
                                {presentFinalPhotos.name} - Tell us a story about your pictures
                            </PictureInstruction>
                        ) : voteForPhotoMessage ? (
                            <>
                                <PictureInstruction>
                                    Vote on your smartphone for the picture that looks most like
                                </PictureInstruction>
                                <RandomWord>{topicMessage?.topic}</RandomWord>
                            </>
                        ) : finalRound ? (
                            <PictureInstruction>
                                Take three photos and tell a visual story about them afterwards
                            </PictureInstruction>
                        ) : (
                            <>
                                <PictureInstruction>Take a picture that represents the word</PictureInstruction>
                                <RandomWord>{topicMessage?.topic}</RandomWord>
                            </>
                        )}
                    </InstructionContainer>

                    {voteForPhotoMessage && (
                        <ImagesContainer>
                            {voteForPhotoMessage.photoUrls?.map((photo, index) => (
                                <ImageContainer key={`image${index}`}>
                                    <PictureInstruction>{photo.photoId}</PictureInstruction>
                                    <Frame>
                                        <StyledImg src={photo.url} />
                                    </Frame>
                                    {votingResults && (
                                        <div>
                                            <StyledChip
                                                label={`+ ${
                                                    votingResults.results.find(
                                                        result => result.photographerId === photo.photographerId
                                                    )?.points
                                                }`}
                                            />
                                        </div>
                                    )}
                                </ImageContainer>
                            ))}
                        </ImagesContainer>
                    )}
                    {presentFinalPhotos && (
                        <ImagesContainer>
                            {presentFinalPhotos.photoUrls?.map((photo, index) => (
                                <ImageContainer key={`image${index}`}>
                                    <Frame>
                                        <StyledImg src={photo} />
                                    </Frame>
                                </ImageContainer>
                            ))}
                        </ImagesContainer>
                    )}
                </>
            )}
        </ScreenContainer>
    );
};
export default Game3;
