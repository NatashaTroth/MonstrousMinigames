import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { handlePlayerGetsStone } from '../../domain/gameState/controller/handlePlayerGetsStone';
import mosquito from '../../images/mosquito.svg';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerDeadContainer, StyledMosquito } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);
    const [counter, setCounter] = React.useState(10);

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
                <StyledMosquito src={mosquito} />
                Oh no! Unfortunately the mosquitos got you.
                <div>You will receive a stone in {counter} seconds</div>
            </PlayerDeadContainer>
        </FullScreenContainer>
    );
};

export default PlayerDead;
