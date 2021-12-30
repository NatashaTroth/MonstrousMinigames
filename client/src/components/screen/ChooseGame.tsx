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
import { MessageTypes } from '../../utils/constants';
import { Routes } from '../../utils/routes';
import Button from '../common/Button';
import { OrangeBase } from '../common/CommonStyles.sc';
import {
    BackButtonContainer,
    Content,
    GamePreviewContainer,
    GameSelectionContainer,
    ImageDescription,
    InfoButton,
    LeftContainer,
    OliverImage,
    PreviewImage,
    PreviewImageContainer,
    RightContainer,
    SelectGameButtonContainer,
} from './ChooseGame.sc';
import { Game1Description, Game1Drawer } from './Game1Description';
import { Game2Description, Game2Drawer } from './Game2Description';
import { Game3Description, Game3Drawer } from './Game3Description';
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
            history.push(`${Routes.screen}/${roomId}/${screenState}`);
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
                            {games.map(game => (
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
                                    <Game1Description />
                                ) : selectedGame.id === GameNames.game2 ? (
                                    <Game2Description />
                                ) : (
                                    <Game3Description />
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
                    <Game1Drawer />
                ) : selectedGame.id === GameNames.game2 ? (
                    <Game2Drawer />
                ) : (
                    <Game3Drawer />
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
