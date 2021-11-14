import * as React from 'react';
import styled from 'styled-components';

import { Game1Context } from '../../contexts/game1/Game1ContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import FullScreenContainer from '../common/FullScreenContainer';
import { Instruction, InstructionContainer, InstructionText } from '../common/Instruction.sc';

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

export const FinishedScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FinishedScreenText = styled(InstructionContainer)`
    width: 100%;
    margin-bottom: 20px;
`;
