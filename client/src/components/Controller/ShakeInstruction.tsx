import * as React from 'react'

import FullScreenContainer from '../common/FullScreenContainer'
import { Container, StyledRotationIcon, StyledShakeInstruction } from './ShakeInstruction.sc'

const ShakeInstruction: React.FunctionComponent = () => {
    return (
        <FullScreenContainer>
            <Container>
                <StyledRotationIcon />
                <StyledShakeInstruction>
                    <span>SHAKE YOUR PHONE!</span>
                    <span>(and maybe your booty)</span>
                </StyledShakeInstruction>
            </Container>
        </FullScreenContainer>
    )
}

export default ShakeInstruction
