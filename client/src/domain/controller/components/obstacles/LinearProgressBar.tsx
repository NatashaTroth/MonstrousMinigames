import React from 'react';

import { LinearProgressContainer, StyledLinearProgress } from './LinearProgressBar.sc';

interface LinearProgressBarProps {
    progress: number;
    MIN?: number;
    MAX?: number;
}

const LinearProgressBar: React.FunctionComponent<LinearProgressBarProps> = ({ progress, MIN = 0, MAX = 50 }) => (
    <LinearProgressContainer>
        <StyledLinearProgress variant="determinate" value={normalise(progress, MIN, MAX)} />
    </LinearProgressContainer>
);

export default LinearProgressBar;

export const normalise = (value: number, MIN: number, MAX: number) =>
    (((value > MAX ? MAX : value) - MIN) * 100) / (MAX - MIN);
