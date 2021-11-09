import { Typography } from '@material-ui/core';
import styled from 'styled-components';

import { StyledFullScreenContainer } from '../../../../components/controller/FullScreenContainer.sc';
import frame from '../../../../images/ui/frame.jpeg';

export const StyledImg = styled.img`
    display: flex;
    width: 100%;
    margin-top: 2px;
    object-fit: cover;
    height: 100%;
`;

export const InstructionContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 40px;
`;

export const PictureInstruction = styled(Typography)`
    font-size: 40px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 700;
    font-style: italic;
    margin-bottom: 30px;
    padding: 0 60px;
`;

export const RandomWord = styled(Typography)`
    font-size: 55px;
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;
`;

export const ScreenContainer = styled(StyledFullScreenContainer)`
    && {
        flex-direction: column;
    }
`;

export const LoadingMessage = styled(Typography)`
    font-size: 20px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 700;
    font-style: italic;
`;

export const ImageContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
`;

export const Frame = styled.div`
    width: 20%;
    height: 55%;
    background: url(${frame});
    margin: auto;
    display: flex;
    background-size: cover;
    align-items: center;
    padding: 2.6%;
    background-position: center;
`;
