import * as React from 'react'

import goal from '../../images/goal.svg'
import { ImageContainer, StyledImage } from './Goal.sc'

const Goal: React.FunctionComponent = () => {
    const x = window.innerWidth - 120
    return (
        <ImageContainer x={x}>
            <StyledImage src={goal} />
        </ImageContainer>
    )
}

export default Goal
