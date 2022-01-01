import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const FileName = styled(Typography)`
    && {
        margin-left: 10px;
        display: flex;
        align-items: center;
    }
`;

export const RandomWord = styled(Typography)`
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 10px;
`;
