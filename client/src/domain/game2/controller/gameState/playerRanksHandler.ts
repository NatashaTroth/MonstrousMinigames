import { History } from 'history';
import React from 'react';

import { PlayerRank } from '../../../../contexts/game2/Game2ContextProvider';
import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { playerRanksTypeGuard } from '../../../typeGuards/game2/playerRanks';

interface Dependencies {
    setPlayerRanks: (val: PlayerRank[]) => void;
    history: History;
}

export const phaseChangedHandler = messageHandler(playerRanksTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setPlayerRanks(message.playerRanks);
});

export const usePhaseChangedHandler = (socket: Socket, handler = phaseChangedHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPlayerRanks } = React.useContext(Game2Context);

    React.useEffect(() => {
        if (!roomId) return;

        const setPlayerRanksWithDependencies = handler({ setPlayerRanks, history });
        setPlayerRanksWithDependencies(socket, roomId);
    }, [handler, roomId, setPlayerRanks, socket]);
};
