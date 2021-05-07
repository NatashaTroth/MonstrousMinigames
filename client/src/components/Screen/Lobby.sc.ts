import { Button, Typography } from '@material-ui/core';
import styled from 'styled-components';

import {
    disabledBackground,
    lightgrey,
    Player1,
    Player2,
    Player3,
    Player4,
    QRCodeBackground,
} from '../../utils/colors';

function getPlayerBackgroundColor(n: number) {
    switch (n) {
        case 1:
            return Player1;
        case 2:
            return Player2;
        case 3:
            return Player3;
        case 4:
            return Player4;
        default:
            return lightgrey;
    }
}
export const LobbyContainer = styled.div`
    background-color: black;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    color: white;
    justify-content: center;
`;

export const HeadContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const Content = styled.div`
    width: 100%;
    max-width: 1560px;
    align-content: center;
    display: flex;
    margin: 60px;
    flex-direction: column;
`;

export const RoomCodeContainer = styled.div`
    width: 100%;
`;

export const HeadContainerLeft = styled.div`
    display: flex;
    width: 70%;
`;

export const HeadContainerRight = styled.div`
    display: flex;
    width: 30%;
    justify-content: center;
`;

export const Headline = styled.div`
    font-size: 30px;
    font-weight: 700;
    background-color: ${disabledBackground};
    color: black;
    padding-left: 20px;
    width: 100%;
    display: flex;
    margin: 20px 0;
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
    color: ${({ free }) => (free ? lightgrey : 'black')};
    background-color: ${({ free, number }) => (free ? disabledBackground : getPlayerBackgroundColor(number))};
    padding: 10px;
    font-size: 25px;
`;

export const ConnectedUserName = styled(User)`
    max-width: 200px;
    display: flex;
    flex-direction: column;
`;

export const ConnectedUserCharacter = styled(User)`
    max-width: 200px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

export const ConnectedUserContainer = styled.div``;

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
    width: 80%;
`;

export const RightContainer = styled.div`
    display: flex;
    width: 30%;
    flex-direction: column;
    align-items: center;
`;

export const LeftContainer = styled.div`
    display: flex;
    width: 70%;
    flex-direction: column;
`;

export const QRCode = styled.div`
    border-radius: 10px;
    background-color: ${QRCodeBackground};
    display: flex;
    flex-direction: column;
    width: 40%;
    padding: 10px;
`;

export const CopyToClipboard = styled(Button)`
    && {
        color: white;
    }
`;

export const QRCodeInstructions = styled(Typography)`
    && {
        margin-bottom: 5px;
    }
`;

export const RightButtonContainer = styled.div`
    margin-top: 30px;

    div:first-child {
        margin-bottom: 20px;
    }
`;
