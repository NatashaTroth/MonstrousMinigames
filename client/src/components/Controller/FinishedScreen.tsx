import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionText } from '../common/Instruction.sc';
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank, dead } = React.useContext(PlayerContext);
    const { hasTimedOut } = React.useContext(GameContext);

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                {(playerRank || hasTimedOut) && (
                    <FinishedScreenText variant="light">
                        {playerRank ? (
                            <>
                                {!dead && (
                                    <Instruction>
                                        <InstructionText>#{playerRank}</InstructionText>
                                    </Instruction>
                                )}
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
            </FinishedScreenContainer>
        </FullScreenContainer>
    );
};
