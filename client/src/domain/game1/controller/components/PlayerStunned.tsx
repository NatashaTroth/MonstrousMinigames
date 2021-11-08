import { Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

import Character from '../../../../components/common/Character';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';

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

const PlayerStunnedContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    align-items: center;
    padding: 20px;
    justify-content: center;
`;
