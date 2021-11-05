import { Typography } from '@material-ui/core';
import * as React from 'react';

import Character from '../../../../components/common/Character';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
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
