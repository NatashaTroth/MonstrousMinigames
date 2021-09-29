/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import Button from '../../components/common/Button';
import { characters } from '../../config/characters';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext, User } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import { MessageTypes, MessageTypesGame1 } from '../../utils/constants';
import { Routes } from '../../utils/routes';
import { ScreenStates } from '../../utils/screenStates';
import { getUserArray } from './Lobby';
import {
    Character,
    CharacterContainer,
    ConnectedUserCharacter,
    ConnectedUserContainer,
    ConnectedUsers,
    ConnectedUserStatus,
    Content,
    GetReadyBackground,
    GetReadyContainer,
} from './PlayersGetReady.sc';

const PlayersGetReady: React.FC = () => {
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);
    const { roomId, connectedUsers, screenAdmin, screenState } = React.useContext(GameContext);

    const emptyGame = !connectedUsers || connectedUsers.length === 0;
    const usersReady =
        !connectedUsers ||
        connectedUsers.filter((user: User) => {
            return user.ready;
        }).length === connectedUsers.length;

    function startGame() {
        screenSocket?.emit({
            type: MessageTypesGame1.startPhaserGame,
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        });
    }

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.screenState,
                state: ScreenStates.getReady,
            });
        }
    }, []);

    React.useEffect(() => {
        if (!screenAdmin && screenState !== ScreenStates.getReady) {
            history.push(`${Routes.screen}/${roomId}/${screenState}`);
        }
    }, [screenState]);

    return (
        <GetReadyContainer>
            <GetReadyBackground>
                <Content>
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
                    {screenAdmin && (
                        <Button
                            disabled={emptyGame || !usersReady}
                            onClick={() => {
                                if (getUserArray(connectedUsers || []).length > 0) {
                                    startGame();
                                }
                            }}
                        >
                            Start
                        </Button>
                    )}
                </Content>
            </GetReadyBackground>
        </GetReadyContainer>
    );
};

export default PlayersGetReady;
