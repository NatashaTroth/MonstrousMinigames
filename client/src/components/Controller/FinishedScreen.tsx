import * as React from 'react';

import { PlayerContext } from '../../contexts/PlayerContextProvider';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionText } from '../common/Instruction.sc';
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank, dead } = React.useContext(PlayerContext);

    return (
        <FullScreenContainer>
            <FinishedScreenContainer>
                <FinishedScreenText variant="light">
                    {!dead && (
                        <Instruction>
                            <InstructionText>#{playerRank}</InstructionText>
                        </Instruction>
                    )}
                    <Instruction>
                        <InstructionText>Finished!</InstructionText>
                    </Instruction>
                </FinishedScreenText>
            </FinishedScreenContainer>
        </FullScreenContainer>
    );
};
