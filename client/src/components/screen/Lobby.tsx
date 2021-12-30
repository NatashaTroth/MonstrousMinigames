/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, IconButton } from '@material-ui/core';
import { Assignment, ZoomOutMap } from '@material-ui/icons';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import { RouteParams } from '../../App';
import Button from '../../components/common/Button';
import { characters } from '../../config/characters';
import { ScreenStates } from '../../config/screenStates';
import { MyAudioContext, Sound } from '../../contexts/AudioContextProvider';
import { Game3Context } from '../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/screen/ScreenSocketContextProvider';
import history from '../../domain/history/history';
import { MessageTypes } from '../../utils/constants';
import { generateQRCode } from '../../utils/generateQRCode';
import { Routes, screenChooseGameRoute, screenLeaderboardRoute } from '../../utils/routes';
import {
    Character,
    CharacterContainer,
    ConnectedUserCharacter,
    ConnectedUserContainer,
    ConnectedUsers,
    ConnectedUserStatus,
    Content,
    ContentContainer,
    ContentWrapper,
    CopyToClipboard,
    DialogContent,
    FullScreenIcon,
    LeftContainer,
    LobbyContainer,
    QRCode,
    QRCodeInstructions,
    QRCodeWrapper,
    RightButtonContainer,
    RightContainer,
} from './Lobby.sc';
import LobbyHeader from './LobbyHeader';

export const Lobby: React.FunctionComponent = () => {
    const { roomId, connectedUsers, screenAdmin, screenState, resetGame } = React.useContext(GameContext);
    const { screenSocket, handleSocketConnection } = React.useContext(ScreenSocketContext);
    const { resetGame3 } = React.useContext(Game3Context);
    const { changeSound } = React.useContext(MyAudioContext);
    const { id }: RouteParams = useParams();
    const navigator = window.navigator;
    const [qRCodeDialogOpen, setQRCodeDialogOpen] = React.useState(false);

    React.useEffect(() => {
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.screenState,
                state: ScreenStates.lobby,
            });
        }

        changeSound(Sound.lobby);

        if (screenSocket) {
            resetGame();
            resetGame3();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (id && !screenSocket) {
        handleSocketConnection(id, 'lobby');
    }

    React.useEffect(() => {
        if (!screenAdmin && screenState !== ScreenStates.lobby) {
            history.push(`${Routes.screen}/${roomId}/${screenState}`);
        }
    }, [screenState]);

    async function handleCopyToClipboard() {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}screen/${roomId}/lobby`);
        }
    }

    React.useEffect(() => {
        generateQRCode(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`, 'qrCode');
    }, [roomId]);

    function handleQRCodeFullscreen() {
        setQRCodeDialogOpen(true);
    }

    return (
        <>
            <LobbyContainer>
                <Content>
                    <LobbyHeader />
                    <ContentContainer>
                        <LeftContainer>
                            <ConnectedUsers>
                                {getUserArray(connectedUsers || []).map((user, index) => (
                                    <ConnectedUserContainer key={`LobbyScreen${roomId}${user.number}`}>
                                        <ConnectedUserCharacter number={user.number} free={user.free}>
                                            <CharacterContainer>
                                                {!user.free && user.characterNumber !== -1 && (
                                                    <Character src={characters[Number(user.characterNumber)].src} />
                                                )}
                                            </CharacterContainer>

                                            {user.free ? `Player ${user.number}` : user.name}
                                        </ConnectedUserCharacter>
                                        <ConnectedUserStatus number={user.number} free={user.free}>
                                            {!user.free && (user.ready ? 'Ready' : 'Not Ready')}
                                            {user.free && user.name}
                                        </ConnectedUserStatus>
                                    </ConnectedUserContainer>
                                ))}
                            </ConnectedUsers>
                        </LeftContainer>
                        <RightContainer>
                            <QRCode>
                                <FullScreenIcon>
                                    <QRCodeInstructions>Scan QR-Code to add your mobile device:</QRCodeInstructions>
                                    <IconButton onClick={handleQRCodeFullscreen} color="inherit">
                                        <ZoomOutMap />
                                    </IconButton>
                                </FullScreenIcon>
                                <div id="qrCode" />
                                <CopyToClipboard onClick={handleCopyToClipboard}>
                                    Copy to Clipboard
                                    <Assignment />
                                </CopyToClipboard>
                            </QRCode>
                            <RightButtonContainer>
                                <Button
                                    onClick={() => history.push(screenChooseGameRoute(roomId))}
                                    disabled={!screenAdmin || !connectedUsers || connectedUsers?.length === 0}
                                    variant="secondary"
                                    title={
                                        screenAdmin
                                            ? !connectedUsers || connectedUsers?.length === 0
                                                ? 'Wait for users to join'
                                                : ''
                                            : 'Please select the game on the admin screen'
                                    }
                                >
                                    Choose Game
                                </Button>

                                <Button onClick={() => history.push(screenLeaderboardRoute(roomId))}>
                                    Leaderboard
                                </Button>
                                <Button onClick={() => history.push(Routes.screen)}>Back</Button>
                            </RightButtonContainer>
                        </RightContainer>
                    </ContentContainer>
                </Content>
            </LobbyContainer>
            <Dialog
                maxWidth="md"
                open={qRCodeDialogOpen}
                PaperProps={{
                    style: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        width: '80%',
                        height: '80%',
                    },
                }}
                onEntered={() => {
                    generateQRCode(`${process.env.REACT_APP_FRONTEND_URL}${roomId}`, 'qrCodeFullscreen');
                }}
                onClose={() => setQRCodeDialogOpen(false)}
                fullScreen
            >
                <DialogContent>
                    <ContentWrapper>
                        <QRCode size="fullscreen">
                            <QRCodeInstructions color="inherit">
                                Scan QR-Code to add your mobile device:
                            </QRCodeInstructions>
                            <QRCodeWrapper id="qrCodeFullscreen" />
                            <CopyToClipboard onClick={handleCopyToClipboard}>
                                Copy to Clipboard
                                <Assignment />
                            </CopyToClipboard>
                        </QRCode>
                    </ContentWrapper>
                </DialogContent>
            </Dialog>
        </>
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
