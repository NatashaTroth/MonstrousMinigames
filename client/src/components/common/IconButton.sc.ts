import styled from 'styled-components';

import { StyledButtonBase } from './Button.sc';

interface StyledIconButton {
    right: number;
}

export const StyledIconButton = styled(StyledButtonBase)<StyledIconButton>`
    && {
        border-radius: 10px;
    }
`;
