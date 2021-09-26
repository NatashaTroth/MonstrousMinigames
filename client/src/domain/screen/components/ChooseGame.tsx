import * as React from 'react';

import Button from '../../../components/common/Button';
import { AudioContext } from '../../../contexts/AudioContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import oliverLobby from '../../../images/characters/oliverLobby.svg';
import game1Img from '../../../images/ui/instructions1.png';
import { MessageTypes } from '../../../utils/constants';
import { Routes, screenGameIntroRoute, screenGetReadyRoute } from '../../../utils/routes';
import { ScreenStates } from '../../../utils/screenStates';
import { handleAudioPermission } from '../../audio/handlePermission';
import history from '../../history/history';
import {
    BackButtonContainer,
    Content,
    GamePreviewContainer,
    GameSelectionContainer,
    LeftContainer,
    OliverImage,
    PreviewImage,
    RightContainer,
    SelectGameButtonContainer,
} from './ChooseGame.sc';
import { LobbyContainer } from './Lobby.sc';
import LobbyHeader from './LobbyHeader';

const ChooseGame: React.FunctionComponent = () => {
    const [selectedGame, setSelectedGame] = React.useState(0);
    const { roomId, screenAdmin, screenState } = React.useContext(GameContext);
    const tutorial = localStorage.getItem('tutorial') ? false : true;
    const { audioPermission, setAudioPermissionGranted } = React.useContext(AudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

    const games = [
        {
            id: 1,
            name: 'The Great Monster Escape',
            image: game1Img,
        },
        { id: 2, name: 'Game 2 - coming soon' },
        { id: 3, name: 'Game 3 - coming soon' },
        { id: 4, name: 'Game 4 - coming soon' },
    ];

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
    }, []);

    React.useEffect(() => {
        handleAudioPermission(audioPermission, { setAudioPermissionGranted });
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.screenState,
                state: ScreenStates.chooseGame,
                game: selectedGame,
            });
        }
    }, [selectedGame]);

    React.useEffect(() => {
        if (!screenAdmin && screenState !== ScreenStates.chooseGame) {
            history.push(`${Routes.screen}/${roomId}/${screenState}`);
        }
    }, [screenState]);

    return (
        <LobbyContainer>
            <Content>
                <LobbyHeader />
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
                            {screenAdmin && (
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        tutorial
                                            ? history.push(screenGameIntroRoute(roomId))
                                            : history.push(screenGetReadyRoute(roomId))
                                    }
                                    fullwidth
                                >{`Start ${games[selectedGame].name}`}</Button>
                            )}
                        </SelectGameButtonContainer>
                        <BackButtonContainer>
                            {screenAdmin && <Button onClick={history.goBack}>Back</Button>}
                        </BackButtonContainer>
                    </RightContainer>
                </GameSelectionContainer>
            </Content>
        </LobbyContainer>
    );
};

export default ChooseGame;
