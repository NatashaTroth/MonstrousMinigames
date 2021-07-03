import { Typography } from '@material-ui/core';
import * as React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import { PlayerContext } from '../../contexts/PlayerContextProvider';
import history from '../../domain/history/history';
import { characterDictionary } from '../../utils/characterDictionary';
import { charactersStunned } from '../../utils/characters';
import { controllerGame1Route } from '../../utils/routes';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerStunnedContainer, StyledCharacter } from './PlayerStunned.sc';

const PlayerStunned: React.FC = () => {
    const { roomId } = React.useContext(GameContext);
    const { character } = React.useContext(PlayerContext);

    // TODO change
    React.useEffect(() => {
        setTimeout(() => history.push(controllerGame1Route(roomId)), 30000);
    }, []);

    return (
        <FullScreenContainer>
            <PlayerStunnedContainer>
                {character && <StyledCharacter src={charactersStunned[characterDictionary[character]]} />}
                <Typography>Oh no! Someone threw a stone at you</Typography>
            </PlayerStunnedContainer>
        </FullScreenContainer>
    );
};

export default PlayerStunned;
