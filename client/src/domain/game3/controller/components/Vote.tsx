import * as React from 'react';
import styled from 'styled-components';

import Countdown from '../../../../components/common/Countdown';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { StyledImg } from '../../screen/components/Game.sc';
import sendVote from '../gameState/sendVote';
import { Instructions, ScreenContainer } from './Game3Styles.sc';

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
                    <Instructions>Choose the picture you like the most</Instructions>
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
            {timeIsUp && <Instructions>Your vote has been submitted, waiting for the others...</Instructions>}
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

const ButtonContainer = styled.div`
    margin-bottom: 30px;
`;
const VoteForPictureContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 30px;
    width: 100%;
    align-self: stretch;
`;
const MediumImageContainer = styled.div`
    display: flex;
    width: 45%;
    padding: 0.5rem;
`;
