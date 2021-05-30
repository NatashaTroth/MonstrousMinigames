import * as React from 'react';

import { ControllerSocketContext } from '../../contexts/ControllerSocketContextProvider';
import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { handleResetGame } from '../../domain/gameState/controller/handleResetGame';
import Button from '../common/Button';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionText } from '../common/Instruction.sc';
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank, isPlayerAdmin, resetPlayer } = React.useContext(PlayerContext);
    const { resetGame, hasTimedOut } = React.useContext(GameContext);
    const { controllerSocket } = React.useContext(ControllerSocketContext);

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                {(playerRank || hasTimedOut) && (
                    <FinishedScreenText variant="light">
                        {playerRank ? (
                            <>
                                <Instruction>
                                    <InstructionText>#{playerRank}</InstructionText>
                                </Instruction>
                                <Instruction>
                                    <InstructionText>Finished!</InstructionText>
                                </Instruction>
                            </>
                        ) : (
                            <Instruction>
                                <InstructionText>Game has timed out</InstructionText>
                            </Instruction>
                        )}
                    </FinishedScreenText>
                )}
                <FinishedScreenText variant="light">
                    <></>
                </FinishedScreenText>

                {/* TODO check if all players are finished */}
                {isPlayerAdmin && (
                    <Button onClick={() => handleResetGame(controllerSocket, { resetPlayer, resetGame }, true)}>
                        Back to Lobby
                    </Button>
                )}
            </FinishedScreenContainer>
        </FullScreenContainer>
    );
};
