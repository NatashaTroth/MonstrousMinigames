import styled, { css } from 'styled-components';

import { darkGreen, primary, readyButton, secondary } from '../../utils/colors';
import { Label } from './Label.sc';

interface Instruction {
    variant?: 'light' | 'dark' | 'none' | 'primary' | 'secondary';
}

export const Instruction = styled(Label)<Instruction>`
    background-color: ${({ variant = 'none' }) => {
        switch (variant) {
            case 'light':
                return readyButton;
            case 'dark':
                return darkGreen;
            case 'primary':
                return primary;
            case 'secondary':
                return secondary;
            default:
                return '';
        }
    }};
    border-radius: 10px;
    margin-bottom: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ variant = 'none' }) =>
        (variant === 'primary' || variant === 'secondary') &&
        css`
            color: black;
        `}
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
