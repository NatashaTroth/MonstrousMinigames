import * as React from 'react';

import { StyledIconButton } from './IconButton.sc';

interface IButton {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    right?: number;
}

const IconButton: React.FunctionComponent<IButton> = ({
    children,
    onClick,
    disabled,
    variant = 'primary',
    right = 20,
}) => (
    <StyledIconButton disabled={disabled} onClick={onClick} variant={variant} right={right}>
        {children}
    </StyledIconButton>
);

export default IconButton;
