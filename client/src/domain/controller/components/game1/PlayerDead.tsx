/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

import Character from '../../../../components/common/Character';
import FullScreenContainer from '../../../../components/common/FullScreenContainer';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import history from '../../../history/history';
import { handlePlayerGetsWindmill } from '../../gameState/game1/handlePlayerGetsWindmill';
import { ObstacleInstructions } from './obstacles/ObstacleStyles.sc';
import { PlayerDeadContainer } from './PlayerDead.sc';

const PlayerDead: React.FC = () => {
    const { roomId } = React.useContext(GameContext);

    const { character, exceededChaserPushes } = React.useContext(PlayerContext);
    const [counter, setCounter] = React.useState(10);

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
                            <div>A windmill will appear in {counter} seconds.</div>Rotate it to speed up the mosquitos.
                        </>
                    )}
                </ObstacleInstructions>
            </PlayerDeadContainer>
        </FullScreenContainer>
    );
};

export default PlayerDead;
