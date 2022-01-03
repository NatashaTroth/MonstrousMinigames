import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const Instructions = styled(Typography)`
    color: ${({ theme }) => theme.palette.primary.main};
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin: 30px 0;
    padding: 0 20px;
`;

export const Round = styled(Typography)`
    font-size: 30px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 700;
    font-style: italic;
    margin: 30px 0;
    padding: 0 60px;
`;

export const FormConainter = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
`;
