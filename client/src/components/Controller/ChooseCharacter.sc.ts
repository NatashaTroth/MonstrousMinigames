import styled from 'styled-components';

import forest from '../../images/forest_mobile.svg';

export const ChooseCharacterContainer = styled.div`
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;
    background-image: url(${forest});
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

interface CharacterProps {
    width: number;
}
export const Character = styled.img`
    display: flex;
    width: 100%;
    object-fit: contain;
`;

export const CharacterContainer = styled.div<CharacterProps>`
    display: flex;
    width: ${({ width }) => `${width}%`};
    cursor: pointer;
`;

export const CharactersContainer = styled.div`
    display: flex;
    width: 80%;
    justify-content: space-between;
    margin-top: 20px;
    height: 200px;
`;
