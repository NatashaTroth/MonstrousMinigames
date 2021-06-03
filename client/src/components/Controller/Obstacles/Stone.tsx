import * as React from 'react';

import pebble from '../../../images/pebble.svg';
import stone from '../../../images/stone.svg';
import Button from '../../common/Button';
import {
    ButtonContainer,
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

    function handleTouch() {
        if (counter <= limit) {
            setCounter(counter + 1);
        }
    }

    function handleThrow() {
        // TODO
    }

    return (
        <StoneContainer>
            <StyledStone onTouchStart={handleTouch}>
                {counter <= limit ? (
                    <StyledStoneImage src={stone} />
                ) : (
                    <>
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
                    </>
                )}
            </StyledStone>
            {counter > limit && (
                <ButtonContainer>
                    <Button onClick={handleThrow}>Throw</Button>
                </ButtonContainer>
            )}
        </StoneContainer>
    );
};

export default Stone;
