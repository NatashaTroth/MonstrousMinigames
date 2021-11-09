import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import styled from 'styled-components';

import theme from '../../styles/theme';

interface CountdownProps {
    time: number;
    onComplete: () => void;
}
const Countdown: React.FunctionComponent<CountdownProps> = ({ time, onComplete }) => (
    <CountdownCircleTimer
        isPlaying
        duration={time / 1000}
        colors={[
            [theme.palette.primary.main, 0.5],
            [theme.palette.secondary.main, 0.5],
        ]}
        onComplete={onComplete}
    >
        {({ remainingTime }) => <TimeWrapper>{remainingTime}</TimeWrapper>}
    </CountdownCircleTimer>
);

export default Countdown;

const TimeWrapper = styled.div`
    position: relative;
    width: 80px;
    height: 60px;
    font-size: 48px;
`;
