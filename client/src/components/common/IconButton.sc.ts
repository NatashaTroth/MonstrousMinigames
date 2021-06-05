import styled from 'styled-components';

import { StyledButtonBase } from './Button.sc';

interface StyledIconButton {
    right: number;
}

export const StyledIconButton = styled(StyledButtonBase)<StyledIconButton>`
    && {
        position: absolute;
        right: ${({ right }) => right}px;
        top: 10px;

        border-radius: 10px;
    }
`;
