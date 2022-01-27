import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const RandomWord = styled(Typography)`
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;
    font-size: 24px;
    margin-bottom: 10px;
`;
