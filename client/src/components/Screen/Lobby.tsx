import { Assignment } from '@material-ui/icons';
import * as React from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useParams } from 'react-router-dom';

import { IRouteParams } from '../../App';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import history from '../../domain/history/history';
import franz from '../../images/franz.png';
import noah from '../../images/noah.png';
import steffi from '../../images/steffi.png';
import susi from '../../images/susi.png';
import { localDevelopment } from '../../utils/constants';
import { generateQRCode } from '../../utils/generateQRCode';
import AudioButton from '../common/AudioButton';
import Button from '../common/Button';
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
    LeftContainer,
    LobbyContainer,
    QRCode,
    QRCodeInstructions,
    RightButtonContainer,
    RightContainer,
} from './Lobby.sc';
import LobbyHeader from './LobbyHeader';

interface WindowProps extends Window {
    webkitAudioContext?: typeof AudioContext;
}

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers } = React.useContext(GameContext);
    const { playLobbyMusic, pauseLobbyMusic, permission, playing, setPermissionGranted } = React.useContext(
        AudioContext
    );
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { id }: IRouteParams = useParams();
    const navigator = window.navigator;
    const characters = [franz, noah, susi, steffi];

    if (id && !screenSocket) {
        handleSocketConnection(id, 'lobby');
    }

    async function handleCopyToClipboard() {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}screen/${roomId}/lobby`);
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

    // React.useEffect(() => {
    //     playLobbyMusic(permission);
    // }, [permission, playLobbyMusic]);
    React.useEffect(() => {
        const w = window as WindowProps;
        const AudioContext = window.AudioContext || w.webkitAudioContext || false;
        if (AudioContext) {
            // eslint-disable-next-line no-console
            console.log('loggy permission granted');
            setPermissionGranted(true);
            new AudioContext().resume();
        }
        playLobbyMusic(permission);
    }, []);

    // React.useEffect(() => {
    //     const w = window as WindowProps;
    //     const AudioContext = window.AudioContext || w.webkitAudioContext || false;
    //     if (AudioContext) {
    //         setPermissionGranted(true);
    //         new AudioContext().resume();
    //     }
    // }, []);

    useBeforeunload(() => {
        pauseLobbyMusic(permission);
    });

    async function handleAudio() {
        const w = window as WindowProps;
        const AudioContext = window.AudioContext || w.webkitAudioContext || false;

        if (!permission) {
            if (AudioContext) {
                // eslint-disable-next-line no-console
                console.log('loggy permission granted');
                setPermissionGranted(true);
                new AudioContext().resume();
            }
        }

        if (playing) {
            pauseLobbyMusic(permission);
        } else {
            playLobbyMusic(permission);
        }
    }

    return (
        <LobbyContainer>
            <Content>
                <AudioButton
                    type="button"
                    name="new"
                    onClick={handleAudio}
                    playing={playing}
                    permission={permission}
                ></AudioButton>
                <LobbyHeader />
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
                                        {user.name.toUpperCase()}
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
                            <Button onClick={() => history.push(`/screen/${roomId}/choose-game`)} variant="secondary">
                                Choose Game
                            </Button>
                            <Button disabled>Leaderboard</Button>
                            <Button onClick={() => history.push('/screen')}>Back</Button>
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

export function getUserArray(connectedUsers: ConnectedUsers[]): ConnectedUsers[] {
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
