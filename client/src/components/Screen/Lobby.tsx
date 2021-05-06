import { Assignment } from '@material-ui/icons';
import * as React from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useParams } from 'react-router-dom';

import { IRouteParams } from '../../App';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import franz from '../../images/franz.png';
import noah from '../../images/noah.png';
import steffi from '../../images/steffi.png';
import susi from '../../images/susi.png';
import { localDevelopment } from '../../utils/constants';
import { generateQRCode } from '../../utils/generateQRCode';
import Button from '../common/Button';
import Logo from '../common/Logo';
import {
    Character,
    CharacterContainer,
    ConnectedUserCharacter,
    ConnectedUserContainer,
    ConnectedUserName,
    ConnectedUsers,
    Content,
    ContentContainer,
    CopyToClipboard,
    HeadContainer,
    HeadContainerLeft,
    HeadContainerRight,
    Headline,
    LeftContainer,
    LobbyContainer,
    QRCode,
    QRCodeInstructions,
    RightButtonContainer,
    RightContainer,
    RoomCodeContainer,
} from './Lobby.sc';
import SelectGameDialog from './SelectGameDialog';

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext);
    const { playLobbyMusic, pauseLobbyMusic, permission } = React.useContext(AudioContext);
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { id }: IRouteParams = useParams();
    const navigator = window.navigator;
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const characters = [franz, noah, susi, steffi];

    if (id && !screenSocket) {
        handleSocketConnection(id, 'lobby');
    }

    async function handleCopyToClipboard() {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`);
        }
    }

    React.useEffect(() => {
        // TODO remove
        if (localDevelopment) {
            generateQRCode(`http://192.168.8.174:3000/${roomId}`, 'qrCode');
        } else {
            generateQRCode(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`, 'qrCode');
        }
    }, [roomId]);

    React.useEffect(() => {
        playLobbyMusic(permission);
    }, [permission, playLobbyMusic]);

    useBeforeunload(() => {
        pauseLobbyMusic(permission);
    });

    return (
        <LobbyContainer>
            <SelectGameDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
            <Content>
                <HeadContainer>
                    <HeadContainerLeft>
                        <RoomCodeContainer>
                            <Headline>Room Code: {roomId}</Headline>
                        </RoomCodeContainer>
                    </HeadContainerLeft>
                    <HeadContainerRight>
                        <Logo />
                    </HeadContainerRight>
                </HeadContainer>
                <ContentContainer>
                    <LeftContainer>
                        <ConnectedUsers>
                            {getUserArray(connectedUsers || []).map((user, index) => (
                                <ConnectedUserContainer key={`LobbyScreen${roomId}${user.number}`}>
                                    <ConnectedUserCharacter number={user.number} free={user.free}>
                                        {!user.free && (
                                            <CharacterContainer>
                                                <Character src={characters[index]} />
                                            </CharacterContainer>
                                        )}

                                        {`Player ${user.number}`}
                                    </ConnectedUserCharacter>
                                    <ConnectedUserName number={user.number} free={user.free}>
                                        {user.name}
                                    </ConnectedUserName>
                                </ConnectedUserContainer>
                            ))}
                        </ConnectedUsers>
                    </LeftContainer>
                    <RightContainer>
                        <QRCode>
                            <QRCodeInstructions>Scan QR-Code to add your mobile device:</QRCodeInstructions>
                            <div id="qrCode" />
                            <CopyToClipboard onClick={handleCopyToClipboard}>
                                Copy to Clipboard
                                <Assignment />
                            </CopyToClipboard>
                        </QRCode>
                        <RightButtonContainer>
                            <Button text="Select Game" onClick={() => setDialogOpen(true)} />
                            <Button text="Leaderboard" disabled />
                        </RightButtonContainer>
                    </RightContainer>
                </ContentContainer>
            </Content>
        </LobbyContainer>
    );
};

interface ConnectedUsers {
    id?: string;
    name: string;
    roomId?: string;
    number: number;
    free?: boolean;
}

function getUserArray(connectedUsers: ConnectedUsers[]): ConnectedUsers[] {
    if (connectedUsers.length === 4) {
        return connectedUsers as ConnectedUsers[];
    }

    const users = [...connectedUsers] as ConnectedUsers[];

    while (users.length < 4) {
        users.push({
            number: users.length + 1,
            name: 'Let`s join',
            free: true,
        });
    }

    return users;
}
