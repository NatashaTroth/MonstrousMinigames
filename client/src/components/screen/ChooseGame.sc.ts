import { IconButton } from '@material-ui/core';
import styled from 'styled-components';

import { GameNames } from '../../config/games';
import { OrangeBase } from '../common/CommonStyles.sc';

export const GameSelectionContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    height: 100%;
    justify-content: space-between;
`;

export const Content = styled.div`
    width: 100%;
    align-content: center;
    display: flex;
    margin: 60px;
    margin-bottom: 0px;
    flex-direction: column;
`;

export const LeftContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    margin-right: 20px;
    justify-content: space-between;

    div:not(:last-child) {
        margin-bottom: 10px;
    }

    @media (min-width: 1000px) {
        width: 15%;
    }
`;

export const RightContainer = styled.div`
    width: 70%;
    height: 100%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 1000px) {
        width: 75%;
    }
`;
export const GamePreviewContainer = styled(OrangeBase)`
    width: 100%;
    height: 90%;
    border-radius: 10px;
`;

export const SelectGameButtonContainer = styled.div`
    margin: 20px 0;
`;

export const BackButtonContainer = styled.div`
    display: flex;
    width: 100%;
    margin: 60px 0 30px 0;
`;

export const OliverImage = styled.img`
    display: flex;
    width: 100%;
    min-width: 200px;
`;

interface PreviewImageContainer {
    src: string;
    game: GameNames;
}

export const PreviewImage = styled.div<PreviewImageContainer>`
    background-image: url(${({ src }) => src});
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: ${({ game }) => (game === GameNames.game2 ? 'left' : 'bottom')};
`;

export const PreviewImageContainer = styled.div`
    display: flex;
    width: 100%;
    height: 25%;
    margin-top: 30px;
`;

export const ImageDescription = styled.div`
    background: ${({ theme }) => theme.palette.secondary.dark};
    color: white;
    font-size: 18px;
    display: flex;
    justify-content: center;
    font-weight: 600;
    align-items: center;
    padding: 10px 20px;
    height: 8%;
    letter-spacing: 1px;
    line-height: 1.5;
`;

export const ControlInstructionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: calc(62% - 75px);
    margin-top: 10px;
`;

export const ControlInstruction = styled.div`
    color: black;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    font-size: 16px;
    font-weight: 700;
    width: 100%;
    letter-spacing: 1px;
    line-height: 1.5;
    margin: 0 10px;
`;

export const InstructionImg = styled.img`
    margin: 20px;
    display: flex;
    width: 100%;
    object-fit: contain;
    height: 90%;
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 18%;
`;

export const ImagesContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    height: 80%;
`;

export const ImageWrapper = styled.div`
    display: flex;
    width: 20%;
    justify-content: center;
    align-items: center;
    height: 75%;
`;

export const TextWrapper = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

export const InfoButton = styled(IconButton)`
    color: inherit;
`;
