import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import history from '../../../domain/history/history';
import pebble from '../../../images/obstacles/stone/pebble.svg';
import stone from '../../../images/obstacles/stone/stone.svg';
import { stoneParticlesConfig } from '../../../utils/particlesConfig';
import { controllerPlayerDeadRoute } from '../../../utils/routes';
import { StyledParticles } from '../../common/Particles.sc';
import {
    PebbleContainer,
    PlayerButtonContainer,
    Ray1,
    Ray2,
    Ray3,
    Ray4,
    Ray5,
    Ray6,
    Ray7,
    Ray8,
    Ray9,
    Ray10,
    RayBox,
    StoneContainer,
    StyledPebbleImage,
    StyledStone,
    StyledStoneImage,
    StyledTypography,
    Sun,
    UserButtons,
} from './Stone.sc';

const Stone: React.FunctionComponent = () => {
    const [counter, setCounter] = React.useState(0);
    const limit = 10;
    const [particles, setParticles] = React.useState(false);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);
    const { connectedUsers, roomId } = React.useContext(GameContext);

    function handleTouch() {
        if (counter <= limit) {
            setParticles(true);
            setCounter(counter + 1);
        }
    }

    function handleThrow(receivingUserId: string) {
        controllerSocket.emit({
            type: 'game1/stunPlayer',
            userId,
            receivingUserId,
        });
        history.push(controllerPlayerDeadRoute(roomId));
    }

    return (
        <>
            <StoneContainer pebble={counter > limit}>
                {counter <= limit ? (
                    <>
                        <StyledTypography>
                            Tap on the rock several times to get a stone. Throw it at a fellow player to freeze the
                            movement for a few seconds.
                        </StyledTypography>
                        <StyledStone onTouchStart={handleTouch}>
                            <StyledStoneImage src={stone} />
                            {particles && <StyledParticles params={stoneParticlesConfig} />}
                        </StyledStone>
                    </>
                ) : (
                    <>
                        <PebbleContainer>
                            <StyledPebbleImage src={pebble} />
                            <Sun>
                                <RayBox>
                                    <Ray1 />
                                    <Ray2 />
                                    <Ray3 />
                                    <Ray4 />
                                    <Ray5 />
                                    <Ray6 />
                                    <Ray7 />
                                    <Ray8 />
                                    <Ray9 />
                                    <Ray10 />
                                </RayBox>
                            </Sun>
                        </PebbleContainer>
                        <UserButtons>
                            {connectedUsers?.map(
                                (user, key) =>
                                    user.id !== userId && (
                                        <PlayerButtonContainer
                                            key={key}
                                            characterNumber={user.characterNumber}
                                            onClick={() => handleThrow(user.id)}
                                        >
                                            {user.name}
                                        </PlayerButtonContainer>
                                    )
                            )}
                        </UserButtons>
                    </>
                )}
            </StoneContainer>
        </>
    );
};

export default Stone;
