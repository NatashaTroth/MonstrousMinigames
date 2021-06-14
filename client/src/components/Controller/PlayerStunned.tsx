import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import history from '../../domain/history/history';
import { controllerGame1Route } from '../../utils/routes';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerStunnedContainer } from './PlayerStunned.sc';

const PlayerStunned: React.FC = () => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        setTimeout(() => history.push(controllerGame1Route(roomId)), 30000);
    }, []);

    return (
        <FullScreenContainer>
            <PlayerStunnedContainer>Oh no! Someone threw a stone at you</PlayerStunnedContainer>
        </FullScreenContainer>
    );
};

export default PlayerStunned;
