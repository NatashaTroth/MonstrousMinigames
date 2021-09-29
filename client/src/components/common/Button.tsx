import { Tooltip } from "@material-ui/core";
import * as React from "react";

import { Container, StyledButton } from "./Button.sc";

interface ButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset' | undefined;
    disabled?: boolean;
    name?: string;
    variant?: 'primary' | 'secondary';
    fullwidth?: boolean;
    title?: string;
    size?: 'small' | 'medium' | 'large';
}

// H'usky test

const Button: React.FunctionComponent<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    disabled,
    name,
    variant = 'primary',
    fullwidth = false,
    title,
    size,
}) => (
    <Container>
        <Tooltip title={title || ''}>
            <span>
                <StyledButton
                    disabled={disabled}
                    onClick={onClick}
                    type={type}
                    name={name}
                    variant={variant}
                    fullwidth={fullwidth}
                    size={size}
                >
                    {children}
                </StyledButton>
            </span>
        </Tooltip>
    </Container>
);

export default Button;
