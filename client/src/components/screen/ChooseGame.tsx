/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, Tooltip } from '@material-ui/core';
import { Info } from '@material-ui/icons';
import * as React from 'react';
import styled from 'styled-components';

import { Game, GameNames, games } from '../../config/games';
import { ScreenStates } from '../../config/screenStates';
import { GameContext } from '../../contexts/GameContextProvider';
import { ScreenSocketContext } from '../../contexts/screen/ScreenSocketContextProvider';
import { handleStartGameClick } from '../../domain/commonGameState/screen/handleStartGameClick';
import history from '../../domain/history/history';
import oliverLobby from '../../images/characters/oliverLobby.svg';
import wood from '../../images/obstacles/wood/wood.svg';
import attention from '../../images/ui/attention.png';
import shakeIt from '../../images/ui/shakeIt.svg';
import spiderDemo from '../../images/ui/spiderDemo.png';
import trashDemo from '../../images/ui/trashDemo.png';
import treeDemo from '../../images/ui/treeDemo.png';
import { MessageTypes } from '../../utils/constants';
import Button from '../common/Button';
import { OrangeBase } from '../common/CommonStyles.sc';
import {
    BackButtonContainer,
    Content,
    ControlInstruction,
    ControlInstructionsContainer,
    GamePreviewContainer,
    GameSelectionContainer,
    ImageDescription,
    ImagesContainer,
    ImageWrapper,
    InfoButton,
    InstructionImg,
    LeftContainer,
    OliverImage,
    PreviewImage,
    PreviewImageContainer,
    RightContainer,
    SelectGameButtonContainer,
    TextWrapper,
    Wrapper,
} from './ChooseGame.sc';
import { LobbyContainer } from './Lobby.sc';
import LobbyHeader from './LobbyHeader';

const ChooseGame: React.FunctionComponent = () => {
    const lastSelectedGame = localStorage.getItem('game');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedGame, setSelectedGame] = React.useState<Game>(
        lastSelectedGame ? games.find(game => game.id === lastSelectedGame) || games[0] : games[0]
    );
    const { roomId, screenAdmin, screenState, setChosenGame } = React.useContext(GameContext);
    const { screenSocket } = React.useContext(ScreenSocketContext);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    React.useEffect(() => {
        if (screenAdmin) {
            screenSocket?.emit({
                type: MessageTypes.screenState,
                state: ScreenStates.chooseGame,
                game: selectedGame.id,
            });
        }
    }, [selectedGame]);

    React.useEffect(() => {
        if (!screenAdmin && !screenState.startsWith(ScreenStates.chooseGame)) {
            // history.push(`${Routes.screen}/${roomId}/${screenState}`);
        } else if (!screenAdmin && screenState.startsWith(ScreenStates.chooseGame)) {
            const gameId = screenState.replace(`${ScreenStates.chooseGame}/`, '');
            const preselectedGame = games.filter(game => {
                return game.id === gameId;
            })[0];
            if (preselectedGame) {
                setSelectedGame(preselectedGame);
            }
        }
    }, [screenState]);

    return (
        <LobbyContainer>
            <Content>
                <LobbyHeader />
                <InstructionDialog
                    open={dialogOpen}
                    handleClose={() => setDialogOpen(false)}
                    selectedGame={selectedGame}
                />
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
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <PreviewImageContainer>
                                    <PreviewImage src={selectedGame.image} />
                                </PreviewImageContainer>
                                <ImageDescription>
                                    {selectedGame.imageDescription}{' '}
                                    <Tooltip title="Click for more information">
                                        <span>
                                            <InfoButton onClick={handleOpenDialog}>
                                                <Info />
                                            </InfoButton>
                                        </span>
                                    </Tooltip>
                                </ImageDescription>
                                {selectedGame.id === GameNames.game1 ? (
                                    <Game1Description openDialog={handleOpenDialog} />
                                ) : selectedGame.id === GameNames.game2 ? (
                                    <Game2Description openDialog={handleOpenDialog} />
                                ) : (
                                    <Game3Description openDialog={handleOpenDialog} />
                                )}
                            </div>
                        </GamePreviewContainer>
                        <SelectGameButtonContainer>
                            {screenAdmin && (
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        handleStartGameClick(
                                            setChosenGame,
                                            selectedGame,
                                            roomId,
                                            screenAdmin,
                                            screenSocket
                                        )
                                    }
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

interface DescriptionProps {
    openDialog: () => void;
}

const Game1Description: React.FunctionComponent<DescriptionProps> = ({ openDialog }) => (
    <ControlInstructionsContainer>
        <ImagesContainer>
            <ImageWrapper>
                <InstructionImg src={shakeIt} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={attention} />
            </ImageWrapper>
            <ImageWrapper>
                <InstructionImg src={wood} />
            </ImageWrapper>
        </ImagesContainer>
        <TextWrapper>
            <ControlInstruction>Shake your phone to run!</ControlInstruction>
            <ControlInstruction>Look at your phone if this icon appears on screen!</ControlInstruction>
            <ControlInstruction>Remove the obstacles on your way!</ControlInstruction>
        </TextWrapper>
    </ControlInstructionsContainer>
);

const Game2Description: React.FunctionComponent<DescriptionProps> = ({ openDialog }) => (
    <ControlInstructionsContainer>
        <Button onClick={openDialog}>More information</Button>
    </ControlInstructionsContainer>
);

const Game3Description: React.FunctionComponent<DescriptionProps> = ({ openDialog }) => (
    <ControlInstructionsContainer>
        <Button onClick={openDialog}>More information</Button>
    </ControlInstructionsContainer>
);

const Game1DrawerDescription: React.FunctionComponent = () => (
    <ControlInstructionsContainer>
        <Wrapper>
            <InstructionImg src={treeDemo} />
            <ControlInstruction>Remove the tree trunk by cutting it along the line!</ControlInstruction>
        </Wrapper>
        <Wrapper>
            <InstructionImg src={spiderDemo} />
            <ControlInstruction>Blow into the microphone to get rid of the spider!</ControlInstruction>
        </Wrapper>
        <Wrapper>
            <InstructionImg src={trashDemo} />
            <ControlInstruction>
                Put the right trash in the garbage can to get the forest clean again!
            </ControlInstruction>
        </Wrapper>
    </ControlInstructionsContainer>
);

const Game2DrawerDescription: React.FunctionComponent = () => (
    <ControlInstructionsContainer></ControlInstructionsContainer>
);

const Game3DrawerDescription: React.FunctionComponent = () => (
    <ControlInstructionsContainer></ControlInstructionsContainer>
);

interface InstructionDialog {
    open: boolean;
    handleClose: () => void;
    selectedGame: Game;
}

const InstructionDialog: React.FunctionComponent<InstructionDialog> = ({ handleClose, selectedGame, ...props }) => {
    return (
        <Dialog
            {...props}
            maxWidth="md"
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    padding: 20,
                    width: '80%',
                    height: '80%',
                },
            }}
            onClose={handleClose}
        >
            <DialogContent>
                {selectedGame.id === GameNames.game1 ? (
                    <Game1DrawerDescription />
                ) : selectedGame.id === GameNames.game2 ? (
                    <Game2DrawerDescription />
                ) : (
                    <Game3DrawerDescription />
                )}
            </DialogContent>
        </Dialog>
    );
};

const DialogContent = styled(OrangeBase)`
    border-radius: 10px;
    color: black;
    display: flex;
    width: 100%;
    height: 100%;
`;
