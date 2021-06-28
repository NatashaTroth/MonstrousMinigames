import { VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { IUser, ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import { characters } from '../../utils/characters';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
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
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        audioPermission,
        playing,
        setAudioPermissionGranted,
        musicIsPlaying,
        initialPlayLobbyMusic,
    } = React.useContext(AudioContext);
    const { roomId, connectedUsers, screenAdmin } = React.useContext(GameContext);

    const emptyGame = !connectedUsers || connectedUsers.length === 0;
    const usersReady =
        !connectedUsers ||
        connectedUsers.filter((user: IUser) => {
            return user.ready;
        }).length === connectedUsers.length;

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
                    <ConnectedUsers>
                        {getUserArray(connectedUsers || []).map((user, index) => (
                            <ConnectedUserContainer key={`LobbyScreen${roomId}${user.number}`}>
                                <ConnectedUserCharacter number={user.number} free={user.free}>
                                    {!user.free && user.characterNumber !== -1 && (
                                        <CharacterContainer>
                                            <Character src={characters[Number(user.characterNumber)]} />
                                        </CharacterContainer>
                                    )}

                                    {user.free ? `Player ${user.number}` : user.name}
                                </ConnectedUserCharacter>
                                <ConnectedUserName number={user.number} free={user.free}>
                                    {!user.free && (user.ready ? 'Ready' : 'Not Ready')}
                                    {user.free && user.name}
                                </ConnectedUserName>
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
