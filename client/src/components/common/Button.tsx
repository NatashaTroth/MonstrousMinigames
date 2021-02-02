import * as React from 'react'
import { Container, StyledButton } from './Button.sc'

interface IButton {
    text: string
    onClick: (val?: any) => any
}

const Button: React.FunctionComponent<IButton> = ({ text, onClick }) => {
    return (
        <Container>
            <StyledButton onClick={onClick}>{text}</StyledButton>
        </Container>
    )
}

export default Button
