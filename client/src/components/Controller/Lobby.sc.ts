import styled from 'styled-components';

import { darkGreen, playerName, readyButton, secondary } from '../../utils/colors';
import { Label } from '../common/Label.sc';

export const LobbyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 20px;
    justify-content: center;

    .MuiCircularProgress-colorPrimary {
        color: ${secondary};
    }
`;

export const Content = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const PlayerName = styled.div`
    color: ${playerName};
    font-size: 45px;
    letter-spacing: 0.1em;
    font-style: italic;
`;

export const Character = styled.img`
    display: flex;
    height: 200px;
    max-width: 200px;
`;

export const CharacterContainer = styled.div`
    display: flex;
    width: 100%;
`;

export const PlayerContent = styled.div`
    display: flex;
    flex-direction: row;
    width: 50%;
`;

export const LeftContainer = styled.div``;

export const RightContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 20px;
`;

interface Props {
    ready: boolean;
}

export const ReadyButton = styled.div<Props>`
    background-color: ${({ ready }) => (ready ? playerName : readyButton)};
    color: white;
    font-style: italic;
    text-transform: uppercase;
    font-size: 26px;
    padding: 10px 15px;
    border-radius: 20px;
    letter-spacing: 4px;
`;

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
