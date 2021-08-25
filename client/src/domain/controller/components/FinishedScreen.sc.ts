import styled from 'styled-components';

import { InstructionContainer } from '../../../components/common/Instruction.sc';

export const FinishedScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const FinishedScreenText = styled(InstructionContainer)`
    width: 100%;
    margin-bottom: 20px;
`;
