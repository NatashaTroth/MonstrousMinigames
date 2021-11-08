import styled from 'styled-components';

import { ContentBase, ContentContainer } from '../common/FullScreenStyles.sc';

export const Content = styled(ContentBase)`
    padding: 60px 60px;
    justify-content: center;
    align-items: unset;
`;

export const GetReadyBackground = styled(ContentContainer)`
    align-items: center;
    justify-content: center;
    padding: 30px;
`;

export const ConnectedUsers = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 30px;
`;

interface Props {
    number: number;
    free?: boolean;
}

const User = styled.div<Props>`
    border-radius: 10px;
    color: black;
    background-color: ${({ theme }) => theme.palette.primary.main};
    padding: 10px;
    font-size: 20px;
`;

export const ConnectedUserStatus = styled(User)`
    max-width: 200px;
    display: flex;
    flex-direction: column;
    background-color: ${({ free, theme }) => (free ? '#8c9d99' : theme.palette.primary.main)};

    @media (min-width: 1200px) {
        font-size: 25px;
    }
`;

export const ConnectedUserCharacter = styled(User)`
    height: 240px;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    justify-content: ${({ free }) => (free ? 'flex-end' : 'center')};
    background-color: ${({ free, theme }) => (free ? '#8c9d99' : theme.palette.primary.main)};

    @media (min-width: 875px) {
        justify-content: ${({ free }) => (free ? 'flex-end' : 'space-between')};
    }
    @media (min-width: 1000px) {
        justify-content: ${({ free }) => (free ? 'flex-end' : 'center')};
    }

    @media (min-width: 1200px) {
        font-size: 25px;
        justify-content: ${({ free }) => (free ? 'flex-end' : 'space-between')};
    }
`;

export const ConnectedUserContainer = styled.div`
    width: 20%;
`;

export const CharacterContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`;

export const Character = styled.img`
    display: flex;
    width: 100%;

    @media (min-width: 1200px) {
        width: 80%;
    }
`;
