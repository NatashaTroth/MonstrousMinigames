import { CircularProgress } from '@material-ui/core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { localDevelopment } from '../../utils/constants';
import Button from '../common/Button';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { AdminLabel, Label } from '../common/Label.sc';
import {
    Character,
    CharacterContainer,
    Content,
    LeftContainer,
    LobbyContainer,
    PlayerContent,
    PlayerName,
    ReadyButton,
    RightContainer,
} from './Lobby.sc';

export const Lobby: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { isPlayerAdmin, permission, playerNumber, name, character, ready, setReady } = React.useContext(
        PlayerContext
    );
    const { roomId, gameChosen, tutorial } = React.useContext(GameContext);
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
                        {!gameChosen ? (
                            <InstructionContainer variant="light">
                                <Instruction>
                                    <InstructionText>Player 1 is now choosing a game!</InstructionText>
                                </Instruction>
                                <Instruction>
                                    <InstructionText>Watch on your monitor!</InstructionText>
                                </Instruction>
                            </InstructionContainer>
                        ) : tutorial ? (
                            <>
                                <InstructionContainer>
                                    <Instruction variant="dark">
                                        <InstructionText>Watch the tutorial on your monitor!</InstructionText>
                                    </Instruction>
                                </InstructionContainer>
                                <InstructionContainer>
                                    <Instruction variant="light">
                                        <InstructionText>Or press skip to start the game right away!</InstructionText>
                                    </Instruction>
                                </InstructionContainer>
                            </>
                        ) : (
                            <>
                                {isPlayerAdmin && <AdminLabel>{`You are Player #${playerNumber}`}</AdminLabel>}
                                <Label>
                                    {!ready
                                        ? `Show that you are ready to play!`
                                        : isPlayerAdmin
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
                                        <ReadyButton ready={ready} onClick={() => setReady(true)}>
                                            I am ready!
                                        </ReadyButton>
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
                            </>
                        )}
                    </Content>
                ) : (
                    <CircularProgress />
                )}
            </LobbyContainer>
        </FullScreenContainer>
    );
};
