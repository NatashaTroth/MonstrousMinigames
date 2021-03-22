import LinearProgress from '@material-ui/core/LinearProgress'
import React from 'react'

import { LinearProgressContainer } from './LinearProgressBar.sc'

interface ILinearProgressBar {
    progress: number
}

const LinearProgressBar: React.FunctionComponent<ILinearProgressBar> = ({ progress }) => {
    const MIN = 0
    const MAX = 50

    const normalise = (value: number) => ((value - MIN) * 100) / (MAX - MIN)

    return (
        <LinearProgressContainer>
            <LinearProgress variant="determinate" value={normalise(progress)} />
        </LinearProgressContainer>
    )
}

export default LinearProgressBar
