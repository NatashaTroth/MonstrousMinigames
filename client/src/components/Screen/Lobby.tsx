import { Assignment, Settings, VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import { IRouteParams } from '../../App';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import { characters } from '../../utils/characters';
import { localDevelopment } from '../../utils/constants';
import { generateQRCode } from '../../utils/generateQRCode';
import { Routes, screenChooseGameRoute } from '../../utils/routes';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
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

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers, screenAdmin } = React.useContext(GameContext);
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        audioPermission,
        playing,
        setAudioPermissionGranted,
        musicIsPlaying,
        initialPlayLobbyMusic,
    } = React.useContext(AudioContext);
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { id }: IRouteParams = useParams();
    const navigator = window.navigator;

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

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

    return (
        <LobbyContainer>
            <Content>
                <IconButton onClick={() => history.push(Routes.settings)} right={80}>
                    <Settings />
                </IconButton>
                <IconButton
                    onClick={() =>
                        handleAudio({
                            playing,
                            audioPermission,
                            pauseLobbyMusic,
                            playLobbyMusic,
                            setAudioPermissionGranted,
                        })
                    }
                >
                    {musicIsPlaying ? <VolumeUp /> : <VolumeOff />}
                </IconButton>
                <LobbyHeader />
                <ContentContainer>
                    <LeftContainer>
                        <ConnectedUsers>
                            {getUserArray(connectedUsers || []).map((user, index) => (
                                <ConnectedUserContainer key={`LobbyScreen${roomId}${user.number}`}>
                                    <ConnectedUserCharacter number={user.number} free={user.free}>
                                        {!user.free && user.characterNumber !== -1 && (
                                            <CharacterContainer>
                                                <Character src={characters[Number(user.characterNumber)]} />
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
                            {screenAdmin && (
                                <Button
                                    onClick={() => {
                                        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
                                        history.push(screenChooseGameRoute(roomId));
                                    }}
                                    disabled={!connectedUsers || connectedUsers?.length === 0}
                                    variant="secondary"
                                >
                                    Choose Game
                                </Button>
                            )}
                            <Button disabled>Leaderboard</Button>
                            <Button
                                onClick={() => {
                                    handleAudioPermission(audioPermission, { setAudioPermissionGranted });
                                    history.push(Routes.screen);
                                }}
                            >
                                Back
                            </Button>
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
    characterNumber?: null | number;
    ready?: boolean;
}

export function getUserArray(connectedUsers: ConnectedUsers[]): ConnectedUsers[] {
    if (connectedUsers.length === 4) {
        return connectedUsers as ConnectedUsers[];
    }

    const users = [...connectedUsers] as ConnectedUsers[];

    while (users.length < 4) {
        users.push({
            number: users.length + 1,
            name: `Let's join`,
            free: true,
        });
    }

    return users;
}
