import * as React from 'react'
import { Container, StyledButton } from './Button.sc'

interface IButton {
    text: string
    onClick?: (val?: any) => any
    type?: 'button' | 'submit' | 'reset' | undefined
    disabled?: boolean
}

const Button: React.FunctionComponent<IButton> = ({ text, onClick, type = 'button', disabled }) => {
    return (
        <Container>
            <StyledButton disabled={disabled} onClick={onClick} type={type}>
                {text}
            </StyledButton>
        </Container>
    )
}

export default Button
