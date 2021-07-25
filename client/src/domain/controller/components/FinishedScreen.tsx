import * as React from 'react';

import FullScreenContainer from '../../../components/common/FullScreenContainer';
import { Instruction, InstructionText } from '../../../components/common/Instruction.sc';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
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
