import * as React from 'react';

import { Game1Context } from '../../contexts/game1/Game1ContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionText } from '../common/Instruction.sc';
import { FinishedScreenContainer, FinishedScreenText } from './FinishedScreen.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank } = React.useContext(PlayerContext);
    const { dead } = React.useContext(Game1Context);

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
