import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import { characters } from '../../utils/characters';
import Button from '../common/Button';
import { getUserArray } from './Lobby';
import {
    Character,
    CharacterContainer,
    ConnectedUserCharacter,
    ConnectedUserContainer,
    ConnectedUserName,
    ConnectedUsers,
    Content,
    GetReadyBackground,
    GetReadyContainer,
} from './PlayersGetReady.sc';

const PlayersGetReady: React.FC = () => {
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const { audioPermission, setAudioPermissionGranted, initialPlayLobbyMusic } = React.useContext(AudioContext);
    const { roomId, connectedUsers, screenAdmin } = React.useContext(GameContext);

    const emptyGame = !connectedUsers || connectedUsers.length === 0;

    function startGame() {
        screenSocket?.emit({
            type: 'game1/start',
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
                    {screenAdmin && (
                        <Button
                            disabled={emptyGame}
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
