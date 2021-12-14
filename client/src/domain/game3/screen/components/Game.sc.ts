import { Typography } from '@material-ui/core';
import styled, { css } from 'styled-components';

import { StyledFullScreenContainer } from '../../../../components/controller/FullScreenContainer.sc';

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
    margin: 20px 0;
`;

interface Props {
    small?: boolean;
}

export const PictureInstruction = styled(Typography)<Props>`
    font-size: 30px;
    color: ${({ theme }) => theme.palette.primary.main};
    font-weight: 700;
    font-style: italic;
    margin: 30px 0;
    padding: 0 60px;

    ${({ small = false }) =>
        small &&
        css`
            font-size: 20px;
            margin: 20px 0;
        `}
`;

export const RandomWord = styled(Typography)<Props>`
    font-size: 40px;
    color: ${({ theme }) => theme.palette.secondary.main};
    font-weight: 700;

    ${({ small = false }) =>
        small &&
        css`
            font-size: 25px;
        `}
`;

export const ScreenContainer = styled(StyledFullScreenContainer)`
    && {
        flex-direction: column;
    }
`;

export const ImagesContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    height: 50%;
`;

export const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    align-items: center;
    height: 80%;
`;

export const Frame = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    background-position: center;
    box-shadow: inset 0 0px rgba(255, 255, 255, 0.1), inset 2px -15px 30px rgba(0, 0, 0, 0.4),
        2px 2px 5px rgba(0, 0, 0, 0.3);
`;
