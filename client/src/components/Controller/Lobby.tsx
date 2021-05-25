import { CircularProgress } from '@material-ui/core';
import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { Label } from '../common/Label.sc';
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
    const { playerNumber, name, character, ready, setReady } = React.useContext(PlayerContext);
    const { gameChosen, tutorial } = React.useContext(GameContext);

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
                                <Label>
                                    {!ready
                                        ? `Show that you are ready to play!`
                                        : 'Wait for the admin to start your game!'}
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
