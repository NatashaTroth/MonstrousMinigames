import { VolumeOff, VolumeUp } from '@material-ui/icons';
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { handleAudio } from '../../domain/audio/handleAudio';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import game1Img from '../../images/instructions1.png';
import oliverLobby from '../../images/oliverLobby.svg';
import Button from '../common/Button';
import IconButton from '../common/IconButton';
import {
    BackButtonContainer, Content, GamePreviewContainer, GameSelectionContainer, LeftContainer,
    OliverImage, PreviewImage, RightContainer, SelectGameButtonContainer
} from './ChooseGame.sc';
import { LobbyContainer } from './Lobby.sc';
import LobbyHeader from './LobbyHeader';

const ChooseGame: React.FunctionComponent = () => {
    const [selectedGame, setSelectedGame] = React.useState(0);
    const { roomId } = React.useContext(GameContext);
    const tutorial = localStorage.getItem('tutorial') ? false : true;
    const {
        playLobbyMusic,
        pauseLobbyMusic,
        audioPermission,
        playing,
        setAudioPermissionGranted,
        musicIsPlaying,
        initialPlayLobbyMusic,
    } = React.useContext(AudioContext);

    const games = [
        {
            id: 1,
            name: 'Game 1',
            image: game1Img,
        },
        { id: 2, name: 'Game 2' },
        { id: 3, name: 'Game 3' },
        { id: 4, name: 'Game 4' },
    ];

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        initialPlayLobbyMusic(true);
    }, []);

    return (
        <LobbyContainer>
            <Content>
                <LobbyHeader />
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
                <GameSelectionContainer>
                    <LeftContainer>
                        <div>
                            {games.map((game, index) => (
                                <Button
                                    key={game.name}
                                    variant={index === selectedGame ? 'secondary' : 'primary'}
                                    disabled={index !== 0}
                                    onClick={() => index === 0 && setSelectedGame(game.id)}
                                >
                                    {game.name}
                                </Button>
                            ))}
                        </div>
                        <OliverImage src={oliverLobby} />
                    </LeftContainer>
                    <RightContainer>
                        <GamePreviewContainer>
                            <PreviewImage src={games[selectedGame].image} />
                        </GamePreviewContainer>
                        <SelectGameButtonContainer>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    tutorial
                                        ? history.push(`/screen/${roomId}/game-intro`)
                                        : history.push(`/screen/${roomId}/get-ready`)
                                }
                                fullwidth
                            >{`Start ${games[selectedGame].name}`}</Button>
                        </SelectGameButtonContainer>
                        <BackButtonContainer>
                            <Button onClick={() => history.push(`/screen/${roomId}/lobby`)}>Back</Button>
                        </BackButtonContainer>
                    </RightContainer>
                </GameSelectionContainer>
            </Content>
        </LobbyContainer>
    );
};

export default ChooseGame;
