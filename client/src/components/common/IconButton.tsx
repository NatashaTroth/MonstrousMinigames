import * as React from 'react';
import styled from 'styled-components';

import { StyledButtonBase } from './Button.sc';

const StyledIconButton = styled(StyledButtonBase)`
    && {
        border-radius: 10px;
    }
`;
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
