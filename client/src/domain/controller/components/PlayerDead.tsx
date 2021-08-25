import * as React from 'react';

import Character from '../../../components/common/Character';
import FullScreenContainer from '../../../components/common/FullScreenContainer';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import history from '../../history/history';
import { handlePlayerGetsStone } from '../gameState/handlePlayerGetsStone';
import { PlayerDeadContainer, TextWrapper } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);

    const { character } = React.useContext(PlayerContext);
    const [counter, setCounter] = React.useState(10);

    React.useEffect(() => {
        if (counter > 0) {
            const stoneTimeoutId = setTimeout(() => setCounter(counter - 1), 1000);
            sessionStorage.setItem('stoneTimeoutId', String(stoneTimeoutId));
        } else {
            handlePlayerGetsStone(history, roomId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [counter]);

    return (
        <FullScreenContainer>
            <PlayerDeadContainer>
                {character && <Character src={character.ghost} />}
                <TextWrapper>
                    Oh no! Unfortunately the mosquitoes got you.
                    <div>A magic rock will appear in {counter} seconds</div>. Tap on this rock several times to get a
                    stone. Throw the stone at a fellow player to freeze their movement for a few seconds.
                </TextWrapper>
            </PlayerDeadContainer>
        </FullScreenContainer>
    );
};

export default PlayerDead;
