import styled from 'styled-components';

export const LobbyContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 20px;
    justify-content: center;
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
    color: ${({ theme }) => theme.colors.playerName};
    font-size: 30px;
    letter-spacing: 0.1em;
    font-style: italic;
    margin-bottom: 10px;
`;

export const Character = styled.img`
    display: flex;
    width: 45%;
    max-width: 200px;
`;

export const CharacterContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

export const PlayerContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

interface Props {
    ready: boolean;
}

export const ReadyButton = styled.div<Props>`
    background-color: ${({ ready, theme }) => (ready ? theme.colors.playerName : theme.colors.readyButton)};
    color: ${({ ready }) => (ready ? 'black' : 'white')};
    font-style: italic;
    text-transform: uppercase;
    font-size: 20px;
    padding: 20px 25px;
    border-radius: 20px;
    letter-spacing: 4px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
`;

export const Arrow = styled.img`
    width: 80px;
    margin-left: 110px;
    margin-top: 100px;
    position: absolute;
`;

export const ButtonContainer = styled.div`
    margin-top: 20px;
`;
