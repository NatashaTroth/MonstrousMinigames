import { Dialog } from '@material-ui/core';
import styled from 'styled-components';

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
    width: 100%;
`;
