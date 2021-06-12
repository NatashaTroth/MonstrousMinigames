import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';
import mosquito from '../../images/mosquito.svg';
import { ObstacleRoutes } from '../../utils/constants';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerDeadContainer, StyledMosquito } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        setTimeout(() => history.push(`/controller/${roomId}/${ObstacleRoutes.stone}`), 30000);
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
