import { CircularProgress } from '@material-ui/core';
import * as React from 'react';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { sendUserReady } from '../../domain/gameState/controller/sendUserReady';
import arrow from '../../images/ui/arrow_blue.svg';
import FullScreenContainer from '../common/FullScreenContainer';
import { Label } from '../common/Label.sc';
import {
    Arrow,
    Character,
    CharacterContainer,
    Content,
    LobbyContainer,
    PlayerContent,
    PlayerName,
    ReadyButton,
} from './Lobby.sc';

export const Lobby: React.FunctionComponent = () => {
    const { playerNumber, name, character, ready, setReady } = React.useContext(PlayerContext);
    const { gameChosen, tutorial } = React.useContext(GameContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

    return (
        <FullScreenContainer>
            <LobbyContainer>
                {playerNumber ? (
                    <Content>
                        {/* {!gameChosen ? (
                            <InstructionContainer variant="light">
                                <Instruction>
                                    <InstructionText>The admin monitor is now choosing a game!</InstructionText>
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
                        ) : ( */}
                        <>
                            <Label>
                                {!ready ? `Show that you are ready to play!` : 'Wait for the admin to start your game!'}
                            </Label>
                            <PlayerContent>
                                <PlayerName>{name}</PlayerName>
                                <CharacterContainer>
                                    <Character src={character!} />
                                </CharacterContainer>
                                <ReadyButton
                                    ready={ready}
                                    onClick={() => {
                                        sendUserReady(controllerSocket);
                                        setReady(!ready);
                                    }}
                                >
                                    <span>I am </span>
                                    <span>ready!</span>
                                </ReadyButton>
                                {!ready && <Arrow src={arrow} />}
                            </PlayerContent>
                        </>
                        {/* )} */}
                    </Content>
                ) : (
                    <CircularProgress />
                )}
            </LobbyContainer>
        </FullScreenContainer>
    );
};
