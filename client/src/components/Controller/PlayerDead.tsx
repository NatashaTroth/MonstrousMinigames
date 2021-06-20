import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { handlePlayerGetsStone } from '../../domain/gameState/controller/handlePlayerGetsStone';
import mosquito from '../../images/mosquito.svg';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerDeadContainer, StyledMosquito } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        const stoneTimeoutId = setTimeout(function () {
            handlePlayerGetsStone(roomId);
        }, 30000);
        sessionStorage.setItem('stoneTimeoutId', String(stoneTimeoutId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FullScreenContainer>
            <PlayerDeadContainer>
                <StyledMosquito src={mosquito} />
                Oh no! Unfortunately the mosquitos got you
            </PlayerDeadContainer>
        </FullScreenContainer>
    );
};

export default PlayerDead;
