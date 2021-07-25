import * as React from 'react';

import { StyledIconButton } from './IconButton.sc';

interface ButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    right?: number;
}

const IconButton: React.FunctionComponent<ButtonProps> = ({ children, onClick, disabled, variant = 'primary' }) => (
    <StyledIconButton disabled={disabled} onClick={onClick} variant={variant}>
        {children}
    </StyledIconButton>
);

export default IconButton;
