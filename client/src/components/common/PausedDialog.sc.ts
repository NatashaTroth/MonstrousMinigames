import { Dialog } from '@material-ui/core';
import styled from 'styled-components';

import { OrangeBase } from './CommonStyles.sc';

export const StyledDialog = styled(Dialog)`
    && {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const DialogContent = styled(OrangeBase)`
    && {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 10px;
    }
`;
