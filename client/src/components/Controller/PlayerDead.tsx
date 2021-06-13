import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import mosquito from '../../images/mosquito.svg';
import { controllerStoneRoute } from '../../utils/routes';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerDeadContainer, StyledMosquito } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);
    const { setStoneTimeout } = React.useContext(PlayerContext);
    let stoneTimeout: ReturnType<typeof setTimeout>;

    React.useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        stoneTimeout = setTimeout(() => history.push(controllerStoneRoute(roomId)), 30000);
        setStoneTimeout(stoneTimeout);
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
