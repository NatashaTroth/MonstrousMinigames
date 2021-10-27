import styled from 'styled-components';

import forest from '../../images/ui/forest.svg';

export const GetReadyContainer = styled.div`
    background-image: url(${forest});
    background-size: cover;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Content = styled.div`
    width: 100%;
    align-content: center;
    display: flex;
    padding: 60px 60px;
    justify-content: center;
    flex-direction: column;
`;

export const GetReadyBackground = styled.div`
    background-color: ${({ theme }) => theme.palette.secondary.main};
    border-radius: 40px;
    box-shadow: calc(${({ theme }) => theme.boxShadowDepth} * 1px) calc(${({ theme }) => theme.boxShadowDepth} * 1px) 0
        ${({ theme }) => theme.palette.secondary.dark};
    display: flex;
    width: 80%;
    flex-direction: column;
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
    background-color: ${({ free }) => (free ? '#8c9d99' : '${primary}')};

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
    background-color: ${({ free }) => (free ? '#8c9d99' : '${primary}')};

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
