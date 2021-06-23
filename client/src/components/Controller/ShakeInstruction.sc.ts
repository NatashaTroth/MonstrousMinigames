import { Dialog } from '@material-ui/core';
import styled from 'styled-components';

import { secondary } from '../../utils/colors';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const StyledDialog = styled(Dialog)`
    && {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const DialogContent = styled.div`
    && {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
`;

export const ShakeIt = styled.img`
    display: flex;
    width: 80%;
`;

export const Countdown = styled.div`
    color: ${secondary};
    font-weight: 700;
    font-size: 70px;
`;
