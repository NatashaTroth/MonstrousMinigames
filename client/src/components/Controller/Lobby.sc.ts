import styled from 'styled-components';

import { secondary } from '../../utils/colors';

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
    /* TODO use right color */
    color: yellow;
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
