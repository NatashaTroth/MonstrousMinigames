import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styled from "styled-components";

import theme from "../../styles/theme";

interface CountdownProps {
    time: number;
    keyValue?: string | number;
    onComplete?: () => void;
    size?: 'small' | 'default';
}
const Countdown: React.FunctionComponent<CountdownProps> = ({
    time,
    keyValue,
    onComplete = () => {
        // do nothing
    },
    size = 'default',
}) => (
    <CountdownCircleTimer
        key={keyValue || time}
        size={size === 'small' ? 100 : 180}
        strokeWidth={size === 'small' ? 8 : 12}
        isPlaying
        duration={time / 1000}
        colors={[
            [theme.palette.primary.main, 0.5],
            [theme.palette.secondary.main, 0.5],
        ]}
        onComplete={onComplete}
    >
        {({ remainingTime }) => <TimeWrapper size={size}>{remainingTime}</TimeWrapper>}
    </CountdownCircleTimer>
);

export default Countdown;

interface TimeWrapperProps {
    size: 'default' | 'small';
}

const TimeWrapper = styled.div<TimeWrapperProps>`
    position: relative;
    width: ${({ size }) => (size === 'small' ? '50px' : '80px')};
    height: ${({ size }) => (size === 'small' ? '38px' : '60px')};
    font-size: ${({ size }) => (size === 'small' ? '30px' : '48px')};
`;
