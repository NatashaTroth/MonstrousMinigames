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
export const VoteForPictureContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 30px;
    width: 100%;
    align-self: stretch;
`;
export const MediumImageContainer = styled.div`
    display: flex;
    width: 45%;
    padding: 0.5rem;
`;
