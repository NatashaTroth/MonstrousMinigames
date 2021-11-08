import * as React from 'react';

import Button from '../../../../components/common/Button';
import { ScreenContainer } from './Game3Styles.sc';
import {ButtonContainer, VoteForPictureContainer, VoteInstructions, MediumImageContainer} from './Vote.sc';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import {Frame, ImageContainer, StyledImg, TimeWrapper} from "../../screen/components/Game.sc";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import theme from "../../../../styles/theme";
import {ControllerSocketContext} from "../../../../contexts/ControllerSocketContextProvider";
import {PlayerContext} from "../../../../contexts/PlayerContextProvider";
import sendVote from "../gameState/sendVote";
const Vote: React.FunctionComponent = () => {
    
    const { voteForPhotoMessage  } = React.useContext(Game3Context);
    const [timeIsUp, setTimeIsUp] = React.useState(false);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);


    function handleVote(photographerId: string) {
        sendVote(
            userId,
            photographerId,
            controllerSocket
        );
        setTimeIsUp(true);
    }

    return (
        <ScreenContainer>
            {!timeIsUp && (
                <>
                    <VoteInstructions>Choose the picture you like the most</VoteInstructions>
                    <VoteForPictureContainer>
                        {voteForPhotoMessage.photoUrls
                            .filter((picture) => picture.photographerId !== userId)
                            .map((picture, index) => (
                                <MediumImageContainer
                                    onClick={() => handleVote(picture.photographerId)}
                                    key={`button${index}` }>
                                    <StyledImg src={picture.url} />
                                </MediumImageContainer>
                            ))}
                    </VoteForPictureContainer>
                </>
            )}
            {timeIsUp && (
                <VoteInstructions>Your vote has been submitted, waiting for the others...</VoteInstructions>
            )}
            {!timeIsUp && voteForPhotoMessage.countdownTime > 0 && (
                <CountdownCircleTimer
                    isPlaying
                    duration={voteForPhotoMessage.countdownTime / 1000}
                    colors={[
                        [theme.palette.primary.main, 0.5],
                        [theme.palette.secondary.main, 0.5],
                    ]}
                    onComplete={() => {
                        setTimeIsUp(true);
                    }}
                >
                    {({ remainingTime }) => <TimeWrapper>{remainingTime}</TimeWrapper>}
                </CountdownCircleTimer>
            )}
        </ScreenContainer>
    );
};

export default Vote;
