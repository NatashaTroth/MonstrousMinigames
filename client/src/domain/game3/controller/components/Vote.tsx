import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../../components/common/Button';
import Countdown from '../../../../components/common/Countdown';
import { ControllerSocketContext } from '../../../../contexts/ControllerSocketContextProvider';
import { Game3Context } from '../../../../contexts/game3/Game3ContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import sendVote from '../gameState/sendVote';
import { CountdownContainer, Instructions, ScreenContainer } from './Game3Styles.sc';

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
            {!timeIsUp && voteForPhotoMessage?.countdownTime && voteForPhotoMessage.countdownTime > 0 && (
                <CountdownContainer>
                    <Countdown
                        time={voteForPhotoMessage.countdownTime}
                        size="small"
                        onComplete={() => {
                            setTimeIsUp(true);
                        }}
                    />
                </CountdownContainer>
            )}
            {!timeIsUp && (
                <>
                    <Instructions>Choose the picture you like the most</Instructions>
                    <VoteContainer>
                        {voteForPhotoMessage?.photoUrls
                            .filter(photo => photo.photographerId !== userId)
                            .map((photo, index) => (
                                <ButtonContainer key={`button${index}`}>
                                    <Button onClick={() => handleVote(photo.photographerId)}>{photo.photoId}</Button>
                                </ButtonContainer>
                            ))}
                    </VoteContainer>
                </>
            )}
            {timeIsUp && <Instructions>Your vote has been submitted, waiting for the others...</Instructions>}
        </ScreenContainer>
    );
};

export default Vote;

const ButtonContainer = styled.div`
    margin-bottom: 30px;
`;
const VoteContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 30px;
    width: 100%;
    align-self: stretch;
`;
