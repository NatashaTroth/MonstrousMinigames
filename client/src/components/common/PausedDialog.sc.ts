import { Dialog } from '@material-ui/core';
import styled from 'styled-components';

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
        background-color: ${({ theme }) => theme.palette.secondary.main};
        border-radius: 10px;
        box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px)
            calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0 ${({ theme }) => theme.palette.secondary.dark};
    }
`;
