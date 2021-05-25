import * as React from 'react';

import { Container, StyledButton } from './Button.sc';

interface IButton {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset' | undefined;
    disabled?: boolean;
    name?: string;
    variant?: 'primary' | 'secondary';
    fullwidth?: boolean;
}

const Button: React.FunctionComponent<IButton> = ({
    children,
    onClick,
    type = 'button',
    disabled,
    name,
    variant = 'primary',
    fullwidth = false,
}) => (
    <Container>
        <StyledButton
            disabled={disabled}
            onClick={onClick}
            type={type}
            name={name}
            variant={variant}
            fullwidth={fullwidth}
        >
            {children}
        </StyledButton>
    </Container>
);

export default Button;
