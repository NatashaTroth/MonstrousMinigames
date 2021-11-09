import * as React from 'react';

import Countdown from '../../../../components/common/Countdown';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { StyledImg } from '../../screen/components/Game.sc';
import sendVote from '../gameState/sendVote';
import { ScreenContainer } from './Game3Styles.sc';
import { MediumImageContainer, VoteForPictureContainer, VoteInstructions } from './Vote.sc';

const Vote: React.FunctionComponent = () => {
    const { voteForPhotoMessage } = React.useContext(Game3Context);
    const [timeIsUp, setTimeIsUp] = React.useState(false);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);

    function handleVote(photographerId: string) {
        sendVote(userId, photographerId, controllerSocket);
        setTimeIsUp(true);
    }

    return (
        <ScreenContainer>
            {!timeIsUp && (
                <>
                    <VoteInstructions>Choose the picture you like the most</VoteInstructions>
                    <VoteForPictureContainer>
                        {voteForPhotoMessage.photoUrls
                            .filter(picture => picture.photographerId !== userId)
                            .map((picture, index) => (
                                <MediumImageContainer
                                    onClick={() => handleVote(picture.photographerId)}
                                    key={`button${index}`}
                                >
                                    <StyledImg src={picture.url} />
                                </MediumImageContainer>
                            ))}
                    </VoteForPictureContainer>
                </>
            )}
            {timeIsUp && <VoteInstructions>Your vote has been submitted, waiting for the others...</VoteInstructions>}
            {!timeIsUp && voteForPhotoMessage.countdownTime > 0 && (
                <Countdown
                    time={voteForPhotoMessage.countdownTime}
                    onComplete={() => {
                        setTimeIsUp(true);
                    }}
                />
            )}
        </ScreenContainer>
    );
};

export default Vote;
