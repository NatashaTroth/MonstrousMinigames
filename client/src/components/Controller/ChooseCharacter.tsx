import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import { characters } from '../../utils/characters';
import { Label } from '../common/Label.sc';
import { Character, CharacterContainer, CharactersContainer, ChooseCharacterContainer } from './ChooseCharacter.sc';

const ChooseCharacter: React.FunctionComponent = () => {
    const { setCharacter } = React.useContext(PlayerContext);
    const { roomId } = React.useContext(GameContext);

    return (
        <ChooseCharacterContainer>
            <Label>Choose your character:</Label>
            <CharactersContainer>
                {characters.map((character, index) => (
                    <CharacterContainer
                        width={80 / characters.length}
                        key={`character${index}`}
                        onClick={() => {
                            // eslint-disable-next-line no-console
                            console.log('hier');
                            setCharacter(character);
                            history.push(`/controller/${roomId}/lobby`);
                        }}
                    >
                        <Character src={character.src} />
                    </CharacterContainer>
                ))}
            </CharactersContainer>
        </ChooseCharacterContainer>
    );
};

export default ChooseCharacter;
