import { Chip, Typography } from '@material-ui/core';
import React from 'react';
import styled, { keyframes } from 'styled-components';

interface PhotoProps {
    url: string;
    id?: number;
    votingResult?: number;
}

const Photo: React.FunctionComponent<PhotoProps> = ({ url, id, votingResult }) => (
    <ImageContainer>
        {id && <PictureInstruction>{id}</PictureInstruction>}
        <Frame>
            <StyledImg src={url} />
        </Frame>
        {votingResult !== undefined && (
            <ChipWrapper>
                <StyledChip label={`+ ${votingResult}`} />
            </ChipWrapper>
        )}
    </ImageContainer>
);

export default Photo;

const StyledImg = styled.img`
    display: flex;
    width: 100%;
    margin-top: 2px;
    object-fit: cover;
    height: 100%;
`;

const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    align-items: center;
    height: 100%;
`;

const Frame = styled.div`
    width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    border-radius: 5px;
    padding: 10px;
    background-color: ${({ theme }) => theme.palette.secondary.main};
    background-position: center;
    box-shadow: inset 0 0px rgba(255, 255, 255, 0.1), inset 2px -15px 30px rgba(0, 0, 0, 0.4),
        2px 2px 5px rgba(0, 0, 0, 0.3);
`;

const PictureInstruction = styled(Typography)`
    font-size: 22px;
    color: ${({ theme }) => theme.palette.primary.secondary};
    font-weight: 700;
    font-style: italic;
    margin-bottom: 20px;
    padding: 0 60px;
    background-color: ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
`;

const slideIn = keyframes`
    0% {
        transform: translateY(+1000px) transform: scale(1);
        ;
        opacity: 1;
        scale: 1;
    }

    50% {
        transform: translateY(-200px) scale(1.2);
        opacity: 1;
    }

    100% {
        transform: translateY(-200px) scale(1.2);
        opacity: 0;
    }
`;

const StyledChip = styled(Chip)`
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

const ChipWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;
