import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { localDevelopment } from '../../utils/constants';
import Button from '../common/Button';
import FullScreenContainer from '../common/FullScreenContainer';
import { Label } from '../common/Label.sc';
import {
    Character,
    CharacterContainer,
    Content,
    LeftContainer,
    LobbyContainer,
    PlayerContent,
    PlayerName,
    RightContainer,
} from './Lobby.sc';

export const Lobby: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { isPlayerAdmin, permission, playerNumber, name, character } = React.useContext(PlayerContext);
    const { roomId } = React.useContext(GameContext);
    const history = useHistory();

    function startGame() {
        controllerSocket?.emit({
            type: 'game1/start',
            roomId: sessionStorage.getItem('roomId'),
            userId: sessionStorage.getItem('userId'),
        });
        history.push(`/controller/${roomId}/game1`);
    }

    return (
        <FullScreenContainer>
            <LobbyContainer>
                {playerNumber ? (
                    <Content>
                        <Label>{`You are Player #${playerNumber}`}</Label>
                        <Label>
                            {isPlayerAdmin
                                ? 'Press the "Start Game" button to start the game.'
                                : 'Wait for Player #1 to start your game!'}
                        </Label>
                        <PlayerContent>
                            <LeftContainer>
                                <CharacterContainer>
                                    <Character src={character?.src} />
                                </CharacterContainer>
                            </LeftContainer>
                            <RightContainer>
                                <PlayerName>{name}</PlayerName>
                                <Button>I am ready!</Button>
                            </RightContainer>
                        </PlayerContent>

                        {/* TODO remove start game from controller */}
                        {isPlayerAdmin && (
                            <div>
                                <Button
                                    onClick={() => {
                                        if (permission || localDevelopment) {
                                            startGame();
                                        }
                                    }}
                                >
                                    Start Game
                                </Button>
                            </div>
                        )}
                    </Content>
                ) : (
                    <CircularProgress />
                )}
            </LobbyContainer>
        </FullScreenContainer>
    );
};
