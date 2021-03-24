import React from 'react'

import { LinearProgressContainer, StyledLinearProgress } from './LinearProgressBar.sc'

interface ILinearProgressBar {
    progress: number
    MIN?: number
    MAX?: number
}

const LinearProgressBar: React.FunctionComponent<ILinearProgressBar> = ({ progress, MIN = 0, MAX = 50 }) => {
    const normalise = (value: number) => (((value > MAX ? MAX : value) - MIN) * 100) / (MAX - MIN)

    return (
        <LinearProgressContainer>
            <StyledLinearProgress variant="determinate" value={normalise(progress)} />
        </LinearProgressContainer>
    )
}

export default LinearProgressBar
