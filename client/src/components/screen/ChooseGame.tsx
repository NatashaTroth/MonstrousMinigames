/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import oliverLobby from '../../images/characters/oliverLobby.svg';
import { MessageTypes } from '../../utils/constants';
import { Game, games } from '../../utils/games';
import { Routes, screenGameIntroRoute, screenGetReadyRoute } from '../../utils/routes';
import { ScreenStates } from '../../utils/screenStates';
import Button from '../common/Button';
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
    const [selectedGame, setSelectedGame] = React.useState<Game>(games[0]);
    const { roomId, screenAdmin, screenState, setChosenGame } = React.useContext(GameContext);
    const tutorial = localStorage.getItem('tutorial') ? false : true;
    const { audioPermission, setAudioPermissionGranted } = React.useContext(AudioContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

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

    function handleStartGameClick() {
        setChosenGame(selectedGame.id);
        tutorial ? history.push(screenGameIntroRoute(roomId)) : history.push(screenGetReadyRoute(roomId));
    }

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
                                    variant={game.id === selectedGame.id ? 'secondary' : 'primary'}
                                    disabled={index !== 0}
                                    onClick={() => index === 0 && setSelectedGame(game)}
                                >
                                    {game.name}
                                </Button>
                            ))}
                        </div>
                        <OliverImage src={oliverLobby} />
                    </LeftContainer>
                    <RightContainer>
                        <GamePreviewContainer>
                            <PreviewImage src={selectedGame.image} />
                        </GamePreviewContainer>
                        <SelectGameButtonContainer>
                            {screenAdmin && (
                                <Button
                                    variant="secondary"
                                    onClick={handleStartGameClick}
                                    fullwidth
                                >{`Start ${selectedGame.name}`}</Button>
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
