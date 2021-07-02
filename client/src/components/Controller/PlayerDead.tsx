import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import { handlePlayerGetsStone } from '../../domain/gameState/controller/handlePlayerGetsStone';
import { characterDictionary } from '../../utils/characterDictionary';
import { charactersGhosts } from '../../utils/characters';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerDeadContainer, StyledCharacter, TextWrapper } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);
    const [counter, setCounter] = React.useState(30);
    const { character } = React.useContext(PlayerContext);

    React.useEffect(() => {
        if (counter > 0) {
            const stoneTimeoutId = setTimeout(() => setCounter(counter - 1), 1000);
            sessionStorage.setItem('stoneTimeoutId', String(stoneTimeoutId));
        } else {
            handlePlayerGetsStone(roomId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    return (
        <FullScreenContainer>
            <PlayerDeadContainer>
                {character && <StyledCharacter src={charactersGhosts[characterDictionary[character]]} />}
                <TextWrapper>
                    Oh no! Unfortunately the mosquitos got you.
                    <div>You will receive a stone in {counter} seconds</div>
                </TextWrapper>
            </PlayerDeadContainer>
        </FullScreenContainer>
    );
};

export default PlayerDead;
