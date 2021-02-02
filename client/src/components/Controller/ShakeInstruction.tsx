import * as React from 'react'
import { Container, StyledRotationIcon, StyledShakeInstruction } from './ShakeInstruction.sc'

const ShakeInstruction: React.FunctionComponent = () => {
    return (
        <Container>
            <StyledRotationIcon />
            <StyledShakeInstruction>
                <span>SHAKE YOUR PHONE!</span>
                <span>(and maybe your booty)</span>
            </StyledShakeInstruction>
        </Container>
    )
}

export default ShakeInstruction
