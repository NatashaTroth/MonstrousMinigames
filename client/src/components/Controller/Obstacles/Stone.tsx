import * as React from 'react';

import { ControllerSocketContext } from '../../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import history from '../../../domain/history/history';
import pebble from '../../../images/obstacles/stone/pebble.svg';
import stone from '../../../images/obstacles/stone/stone.svg';
import { stoneParticlesConfig } from '../../../utils/particlesConfig';
import { controllerPlayerDeadRoute } from '../../../utils/routes';
import Button from '../../common/Button';
import { StyledParticles } from '../../common/Particles.sc';
import {
    ButtonContainer,
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
    Sun,
} from './Stone.sc';

const Stone: React.FunctionComponent = () => {
    const [counter, setCounter] = React.useState(0);
    const limit = 10;
    const [particles, setParticles] = React.useState(false);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { userId } = React.useContext(PlayerContext);
    const { roomId, connectedUsers } = React.useContext(GameContext);
    const [chosenPlayer, setChosenPlayer] = React.useState<undefined | string>();

    function handleTouch() {
        if (counter <= limit) {
            setParticles(true);
            setCounter(counter + 1);
        }
    }

    function handleThrow() {
        controllerSocket.emit({
            type: 'game1/stunPlayer',
            userId,
            receivingUserId: chosenPlayer,
        });
        history.push(controllerPlayerDeadRoute(roomId));
    }

    return (
        <StoneContainer pebble={counter > limit}>
            {counter <= limit ? (
                <StyledStone onTouchStart={handleTouch}>
                    <StyledStoneImage src={stone} />
                    {particles && <StyledParticles params={stoneParticlesConfig} />}
                </StyledStone>
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
                    {connectedUsers?.map(
                        (user, key) =>
                            user.id !== userId && (
                                <PlayerButtonContainer
                                    key={key}
                                    onClick={() => setChosenPlayer(user.id)}
                                    characterNumber={user.characterNumber}
                                    selected={user.id === chosenPlayer}
                                >
                                    {user.name}
                                </PlayerButtonContainer>
                            )
                    )}
                </>
            )}

            {counter > limit && (
                <ButtonContainer>
                    <Button onClick={handleThrow} disabled={!chosenPlayer}>
                        Throw
                    </Button>
                </ButtonContainer>
            )}
        </StoneContainer>
    );
};

export default Stone;
