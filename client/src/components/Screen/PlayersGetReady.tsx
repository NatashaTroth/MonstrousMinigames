import { VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import franz from '../../images/franz.png';
import noah from '../../images/noah.png';
import steffi from '../../images/steffi.png';
import susi from '../../images/susi.png';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import { getUserArray } from './Lobby';
import {
    Character, CharacterContainer, ConnectedUserCharacter, ConnectedUserContainer,
    ConnectedUserName, ConnectedUsers, Content, GetReadyBackground, GetReadyContainer
} from './PlayersGetReady.sc';

const PlayersGetReady: React.FC = () => {
    const { screenSocket } = React.useContext(ScreenSocketContext);
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        audioPermission,
        lobbyMusicPlaying,
        setAudioPermissionGranted,
        musicIsPlaying,
    } = React.useContext(AudioContext);
    const { roomId, connectedUsers, screenAdmin } = React.useContext(GameContext);
    const characters = [franz, noah, susi, steffi];

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
        playLobbyMusic(true);
    }, []);

    return (
        <GetReadyContainer>
            <GetReadyBackground>
                <Content>
                    <IconButton
                        onClick={() =>
                            handleAudio({
                                lobbyMusicPlaying,
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
