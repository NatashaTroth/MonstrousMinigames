import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { localDevelopment } from '../../utils/constants';
import Button from '../common/Button';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionContainer, LobbyScreenContainer, StyledTypography } from './Lobby.sc';

export const Lobby: React.FunctionComponent = () => {
    const { controllerSocket } = React.useContext(ControllerSocketContext);
    const { isPlayerAdmin, permission, playerNumber } = React.useContext(PlayerContext);
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
            <LobbyScreenContainer>
                <InstructionContainer>
                    <Instruction>{`You are Player #${playerNumber}`}</Instruction>
                    <StyledTypography>
                        {isPlayerAdmin
                            ? 'When all other players are ready, you have to press the "Start Game" button to start the game.'
                            : 'Wait until Player #1 starts the Game'}
                    </StyledTypography>
                    {isPlayerAdmin && (
                        <div>
                            <Button
                                onClick={() => {
                                    if (permission || localDevelopment) {
                                        startGame();
                                    }
                                }}
                                text="Start Game"
                            />
                        </div>
                    )}
                </InstructionContainer>
            </LobbyScreenContainer>
        </FullScreenContainer>
    );
};
