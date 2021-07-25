import * as React from 'react';
import styled from 'styled-components';

const StyledCharacter = styled.img`
    display: flex;
    width: 80%;
`;

interface CharacterProps {
    src: string;
}

const Character: React.FunctionComponent<CharacterProps> = ({ src }) => <StyledCharacter src={src} />;

export default Character;
