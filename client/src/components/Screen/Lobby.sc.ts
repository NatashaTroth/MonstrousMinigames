import { Button, Typography } from '@material-ui/core';
import styled from 'styled-components';

import forest from '../../images/forest.svg';
import { primary, QRCodeBackground } from '../../utils/colors';

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
    margin: 30px;
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
    background-color: ${primary};
    padding: 10px;
    font-size: 20px;
`;

export const ConnectedUserName = styled(User)`
    max-width: 200px;
    display: flex;
    flex-direction: column;

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

export const Subline = styled.div`
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 20px;
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

export const QRCode = styled.div`
    border-radius: 10px;
    background-color: ${QRCodeBackground};
    display: flex;
    flex-direction: column;
    padding: 10px;

    @media (min-width: 1060px) {
        width: 60%;
    }
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
