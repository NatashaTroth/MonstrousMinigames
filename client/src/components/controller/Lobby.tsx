import { CircularProgress } from '@material-ui/core';
import { History } from 'history';
import * as React from 'react';

import { GameNames } from '../../config/games';
import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { sendUserReady } from '../../domain/commonGameState/controller/sendUserReady';
import arrow from '../../images/ui/arrow_blue.svg';
import { controllerChooseCharacterRoute, controllerTutorialRoute } from '../../utils/routes';
import Button from '../common/Button';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { Label } from '../common/Label.sc';
import {
    Arrow,
    ButtonContainer,
    Character,
    CharacterContainer,
    Content,
    LobbyContainer,
    PlayerContent,
    PlayerName,
    ReadyButton,
} from './Lobby.sc';

interface LobbyProps {
    history: History;
}

export const Lobby: React.FunctionComponent<LobbyProps> = ({ history }) => {
    const { playerNumber, name, character, ready, setReady } = React.useContext(PlayerContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { roomId, chosenGame } = React.useContext(GameContext);

    return (
        <FullScreenContainer>
            <LobbyContainer>
                {playerNumber ? (
                    <Content>
                        {!chosenGame ? (
                            <InstructionContainer variant="light">
                                <Instruction>
                                    <InstructionText>The admin monitor is now choosing a game!</InstructionText>
                                </Instruction>
                                <Instruction>
                                    <InstructionText>Watch on your monitor!</InstructionText>
                                </Instruction>
                            </InstructionContainer>
                        ) : (
                            <>
                                <Label>
                                    {!ready
                                        ? `Show that you are ready to play!`
                                        : 'Wait for the admin to start your game!'}
                                </Label>
                                <PlayerContent>
                                    <PlayerName>{name}</PlayerName>
                                    <CharacterContainer>
                                        <Character src={character?.src} />
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
                                {chosenGame === GameNames.game1 && (
                                    <ButtonContainer>
                                        <Button disabled={ready} onClick={() => handleStartTutorial(history, roomId)}>
                                            Tutorial
                                        </Button>
                                    </ButtonContainer>
                                )}
                                <ButtonContainer>
                                    <Button
                                        onClick={() =>
                                            history.push(`${controllerChooseCharacterRoute(roomId)}?back=true`)
                                        }
                                    >
                                        Change Character
                                    </Button>
                                </ButtonContainer>
                            </>
                        )}
                    </Content>
                ) : (
                    <CircularProgress color="secondary" />
                )}
            </LobbyContainer>
        </FullScreenContainer>
    );
};

export function handleStartTutorial(history: History, roomId: string | undefined) {
    history.push(controllerTutorialRoute(roomId));
}
