/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import styled from 'styled-components';

import Character from '../../../../components/common/Character';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import history from '../../../history/history';
import { handlePlayerGetsWindmill } from '../gameState/handlePlayerGetsWindmill';
import { ObstacleInstructions } from './obstacles/ObstacleStyles.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);

    const { character } = React.useContext(PlayerContext);
    const [counter, setCounter] = React.useState(10);
    const { exceededChaserPushes } = React.useContext(Game1Context);

    React.useEffect(() => {
        if (!exceededChaserPushes) {
            if (counter > 0) {
                const windmillTimeoutId = setTimeout(() => setCounter(counter - 1), 1000);
                sessionStorage.setItem('windmillTimeoutId', String(windmillTimeoutId));
            } else {
                handlePlayerGetsWindmill(history, roomId);
            }
        }
    }, [counter]);

    return (
        <FullScreenContainer>
            <PlayerDeadContainer>
                {character && <Character src={character.ghost} />}
                <ObstacleInstructions>
                    Oh no! Unfortunately the mosquitoes got you.
                    {!exceededChaserPushes && (
                        <>
                            <p>A windmill will appear in {counter} seconds.</p>Rotate it to speed up the mosquitos.
                        </>
                    )}
                </ObstacleInstructions>
            </PlayerDeadContainer>
        </FullScreenContainer>
    );
};

export default PlayerDead;

const PlayerDeadContainer = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    align-items: center;
    padding: 20px;
    justify-content: center;
`;

const TextWrapper = styled.div`
    margin-top: 20px;
`;
