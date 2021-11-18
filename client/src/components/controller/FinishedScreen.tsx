import * as React from 'react';
import styled from 'styled-components';

import { Game1Context } from '../../contexts/game1/Game1ContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';
import { StyledFullScreenContainer } from './FullScreenContainer.sc';

export const FinishedScreen: React.FunctionComponent = () => {
    const { playerRank } = React.useContext(PlayerContext);
    const { dead } = React.useContext(Game1Context);

    return (
        <StyledFullScreenContainer>
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
        </StyledFullScreenContainer>
    );
};

const FinishedScreenText = styled(InstructionContainer)`
    width: 100%;
    margin-bottom: 20px;
`;
