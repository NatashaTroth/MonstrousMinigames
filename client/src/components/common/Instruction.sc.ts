import styled from 'styled-components';

import { darkGreen, readyButton } from '../../utils/colors';
import { Label } from './Label.sc';

interface Instruction {
    variant?: 'light' | 'dark' | 'none';
}

export const Instruction = styled(Label)<Instruction>`
    background-color: ${({ variant = 'none' }) =>
        variant === 'light' ? readyButton : variant === 'dark' ? darkGreen : ''};
    border-radius: 10px;
    margin-bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const InstructionText = styled.div`
    max-width: 260px;
    font-size: 30px;
    padding: 20px;
`;

export const InstructionContainer = styled(Instruction)`
    background-color: ${({ variant = 'none' }) =>
        variant === 'light' ? readyButton : variant === 'dark' ? darkGreen : ''};
    max-width: unset;
    width: 60%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
