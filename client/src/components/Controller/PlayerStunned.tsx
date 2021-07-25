import { Typography } from '@material-ui/core';
import * as React from 'react';

import { PlayerContext } from '../../contexts/PlayerContextProvider';
import Character from '../common/Character';
import FullScreenContainer from '../common/FullScreenContainer';
import { PlayerStunnedContainer } from './PlayerStunned.sc';

const PlayerStunned: React.FC = () => {
    const { character } = React.useContext(PlayerContext);

    return (
        <FullScreenContainer>
            <PlayerStunnedContainer>
                {character && <Character src={character.stunned} />}
                <Typography>Oh no! Someone threw a stone at you</Typography>
            </PlayerStunnedContainer>
        </FullScreenContainer>
    );
};

export default PlayerStunned;
