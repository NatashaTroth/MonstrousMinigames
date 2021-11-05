/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import { Game, games } from '../../config/games';
import { ScreenStates } from '../../config/screenStates';
import { AudioContext } from '../../contexts/AudioContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import { handleAudioPermission } from '../../domain/audio/handlePermission';
import history from '../../domain/history/history';
import oliverLobby from '../../images/characters/oliverLobby.svg';
import shakeInstructionsDemo from '../../images/ui/shakeInstructionDemo.png';
import spiderDemo from '../../images/ui/spiderDemo.png';
import trashDemo from '../../images/ui/trashDemo.png';
import treeDemo from '../../images/ui/treeDemo.png';
import { MessageTypes } from '../../utils/constants';
import { Routes, screenGetReadyRoute } from '../../utils/routes';
import Button from '../common/Button';
import {
    BackButtonContainer,
    Content,
    ControlInstruction,
    ControlInstructionsContainer,
    GamePreviewContainer,
    GameSelectionContainer,
    ImageDescription,
    InstructionImg,
    LeftContainer,
    OliverImage,
    PreviewImageContainer,
    RightContainer,
    SelectGameButtonContainer,
    Wrapper,
} from './ChooseGame.sc';
import { LobbyContainer } from './Lobby.sc';
import LobbyHeader from './LobbyHeader';

const ChooseGame: React.FunctionComponent = () => {
    const [selectedGame, setSelectedGame] = React.useState<Game>(games[0]);
    const { roomId, screenAdmin, screenState, setChosenGame } = React.useContext(GameContext);
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
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.chooseGame,
                game: selectedGame.id,
            });
        }
        history.push(screenGetReadyRoute(roomId));
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
                                    onClick={() => setSelectedGame(game)}
                                    fullwidth
                                >
                                    {game.name}
                                </Button>
                            ))}
                            <BackButtonContainer>
                                {screenAdmin && <Button onClick={history.goBack}>Back</Button>}
                            </BackButtonContainer>
                        </div>
                        <OliverImage src={oliverLobby} />
                    </LeftContainer>
                    <RightContainer>
                        <GamePreviewContainer>
                            <PreviewImageContainer />
                            <ImageDescription>
                                Your goal is to be the first player to reach safety in the cave while conquering
                                obstacles along the way!
                            </ImageDescription>
                            <ControlInstructionsContainer>
                                <Wrapper>
                                    <InstructionImg src={shakeInstructionsDemo} />
                                    <ControlInstruction>Shake your phone to run!</ControlInstruction>
                                </Wrapper>
                                <Wrapper>
                                    <InstructionImg src={treeDemo} />
                                    <ControlInstruction>
                                        Remove the tree trunk by cutting it along the line!
                                    </ControlInstruction>
                                </Wrapper>
                                <Wrapper>
                                    <InstructionImg src={spiderDemo} />
                                    <ControlInstruction>
                                        Blow into the microphone to get rid of the spider!
                                    </ControlInstruction>
                                </Wrapper>
                                <Wrapper>
                                    <InstructionImg src={trashDemo} />
                                    <ControlInstruction>
                                        Put the right trash in the garbage can to get the forest clean again!
                                    </ControlInstruction>
                                </Wrapper>
                            </ControlInstructionsContainer>
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
                    </RightContainer>
                </GameSelectionContainer>
            </Content>
        </LobbyContainer>
    );
};

export default ChooseGame;
