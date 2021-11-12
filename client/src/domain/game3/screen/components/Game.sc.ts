import { Chip, Typography } from "@material-ui/core";
import styled, { keyframes } from "styled-components";

import {
    StyledFullScreenContainer
} from "../../../../components/controller/FullScreenContainer.sc";

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

export const ImagesContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    height: 70%;
`;

export const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    align-items: center;
    height: 90%;
`;

export const Frame = styled.div`
    width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    background-position: center;
    box-shadow: inset 0 0px rgba(255, 255, 255, 0.1), inset 2px -15px 30px rgba(0, 0, 0, 0.4),
        2px 2px 5px rgba(0, 0, 0, 0.3);
`;

const slideIn = keyframes`
    0% {
        transform: translateY(+1000px);
        opacity: 1;
    }

    50% {
        transform: translateY(-500px);
        opacity: 1;
    }

    100% {
        transform: translateY(-500px);
        opacity: 0;
    }
`;

export const StyledChip = styled(Chip)`
    && {
        animation-duration: 8s;
        animation-iteration-count: 1;
        animation-name: ${slideIn};
        transform-origin: origin;
        transition: 4s;
        animation-timing-function: ease;
        box-shadow: ${({ theme }) => `4px 4px 0 ${theme.colors.progressBarGreen}}`};
        animation-fill-mode: forwards;
        position: absolute;
    }
`;
