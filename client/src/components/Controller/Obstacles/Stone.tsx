import * as React from 'react';

import pebble from '../../../images/pebble.svg';
import stone from '../../../images/stone.svg';
import { stoneParticlesConfig } from '../../../utils/particlesConfig';
import Button from '../../common/Button';
import { StyledParticles } from '../../common/Particles.sc';
import {
    ButtonContainer,
    PebbleContainer,
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
    const limit = Math.floor(Math.random() * 16) + 10;
    const [particles, setParticles] = React.useState(false);

    function handleTouch() {
        if (counter <= limit) {
            setParticles(true);
            setCounter(counter + 1);
        }
    }

    function handleThrow() {
        // TODO
    }

    return (
        <StoneContainer pebble={counter > limit}>
            {counter <= limit ? (
                <StyledStone onTouchStart={handleTouch}>
                    <StyledStoneImage src={stone} />
                    {particles && <StyledParticles params={stoneParticlesConfig} />}
                </StyledStone>
            ) : (
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
            )}

            {counter > limit && (
                <ButtonContainer>
                    <Button onClick={handleThrow}>Throw</Button>
                </ButtonContainer>
            )}
        </StoneContainer>
    );
};

export default Stone;
