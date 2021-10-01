import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const VoteInstructions = styled(Typography)`
    color: ${({ theme }) => theme.palette.primary.main};
    font-size: 24px;
    font-weight: 700;
    font-style: italic;
    margin-bottom: 30px;
    padding: 0 20px;
`;

export const ButtonContainer = styled.div`
    margin-bottom: 30px;
`;
