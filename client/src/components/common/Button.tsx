import * as React from 'react';

import { Container, StyledButton } from './Button.sc';

interface IButton {
    text: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset' | undefined;
    disabled?: boolean;
    name?: string;
}

const Button: React.FunctionComponent<IButton> = ({ text, onClick, type = 'button', disabled, name }) => (
    <Container>
        <StyledButton disabled={disabled} onClick={onClick} type={type} name={name}>
            {text}
        </StyledButton>
    </Container>
);

export default Button;
