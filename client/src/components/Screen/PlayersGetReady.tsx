import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { IUser, ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import { characters } from '../../utils/characters';
import { MessageTypes } from '../../utils/constants';
import Button from '../common/Button';
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
    const { roomId, connectedUsers, screenAdmin } = React.useContext(GameContext);

    const emptyGame = !connectedUsers || connectedUsers.length === 0;
    const usersReady =
        !connectedUsers ||
        connectedUsers.filter((user: IUser) => {
            return user.ready;
        }).length === connectedUsers.length;

    function startGame() {
        screenSocket?.emit({
            type: MessageTypes.startPhaserGame,
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        });
    }

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

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
