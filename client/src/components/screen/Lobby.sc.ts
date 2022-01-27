import { Button, Typography } from '@material-ui/core';
import styled, { css } from 'styled-components';

import forest from '../../images/ui/forest.svg';

export const LobbyContainer = styled.div`
    background-image: url(${forest});
    background-size: cover;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    color: white;
    justify-content: center;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;

    @media (min-width: 1060px) {
        flex-direction: row;
    }
`;

export const Content = styled.div`
    width: 100%;
    align-content: center;
    display: flex;
    margin: 60px 30px 30px 30px;
    flex-direction: column;

    @media (min-width: 1200px) {
        margin: 60px;
    }
`;

export const ConnectedUsers = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
`;

interface Props {
    number: number;
    free?: boolean;
}

const User = styled.div<Props>`
    border-radius: 10px;
    color: black;
    background-color: ${({ theme }) => theme.palette.primary.main};
    padding: 10px;
    font-size: 20px;
`;

export const ConnectedUserStatus = styled(User)`
    max-width: 200px;
    display: flex;
    flex-direction: column;
    background-color: ${({ free }) => (free ? '#a7bdb18a' : '${primary}')};

    @media (min-width: 1200px) {
        font-size: 25px;
    }
`;

export const ConnectedUserCharacter = styled(User)`
    height: 240px;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    justify-content: ${({ free }) => (free ? 'flex-end' : 'center')};
    background-color: ${({ free }) => (free ? '#a7bdb18a' : '${primary}')};

    @media (min-width: 875px) {
        justify-content: ${({ free }) => (free ? 'flex-end' : 'space-between')};
    }
    @media (min-width: 1000px) {
        justify-content: ${({ free }) => (free ? 'flex-end' : 'center')};
    }

    @media (min-width: 1200px) {
        font-size: 25px;
        justify-content: ${({ free }) => (free ? 'flex-end' : 'space-between')};
    }
`;

export const ConnectedUserContainer = styled.div`
    width: 20%;
`;

export const CharacterContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`;

export const Character = styled.img`
    display: flex;
    width: 100%;

    @media (min-width: 1200px) {
        width: 80%;
    }
`;

export const RightContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 30px;

    @media (min-width: 1060px) {
        width: 25%;
        flex-direction: column;
        margin-top: 0;
        justify-content: space-between;
    }

    @media (min-width: 1200px) {
        width: 30%;
    }
`;

export const LeftContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;

    @media (min-width: 1060px) {
        width: 75%;
    }

    @media (min-width: 1200px) {
        width: 70%;
    }
`;

interface QRCodeProps {
    size?: 'fullscreen' | 'default';
}

export const QRCode = styled.div<QRCodeProps>`
    display: flex;
    flex-direction: column;

    ${({ size = 'default' }) =>
        size === 'fullscreen'
            ? css`
                  width: 100%;
                  align-items: center;
              `
            : css`
                  @media (min-width: 1060px) {
                      width: 60%;
                  }
                  padding: 10px;
                  border-radius: 10px;
                  background-color: ${({ theme }) => theme.colors.qRCodeBackground};
              `}
`;

export const CopyToClipboard = styled(Button)`
    && {
        color: white;
    }
`;

export const QRCodeInstructions = styled(Typography)`
    && {
        margin-bottom: 5px;
        font-weight: 700;
    }
`;

export const RightButtonContainer = styled.div`
    div:not(:last-child) {
        margin-bottom: 20px;
    }
`;

export const FullScreenIcon = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

export const DialogContent = styled.div`
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.qRCodeBackground};
    color: white;
    display: flex;
    width: 100%;
    height: 100%;
`;

export const ContentWrapper = styled.div`
    padding: 40px 60px;
    display: flex;
    width: 100%;
`;

export const QRCodeWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 20px;
    height: 100%;
    width: 100%;

    canvas {
        display: flex !important;
        width: auto !important;
        height: 100% !important;
    }
`;
