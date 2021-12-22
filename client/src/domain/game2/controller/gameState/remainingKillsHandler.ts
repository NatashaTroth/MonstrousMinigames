import React from 'react';

import { Game2Context } from '../../../../contexts/game2/Game2ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { remainingKillsTypeGuard } from '../../../typeGuards/game2/remainingKills';

interface Dependencies {
    setRemainingKills: (val: number) => void;
}

export const remainingKillsHandler = messageHandler(remainingKillsTypeGuard, (message, dependencies: Dependencies) => {
    const { setRemainingKills } = dependencies;
    setRemainingKills(message.remainingKills);
});

export const useRemainingKillsHandler = (socket: Socket, handler = remainingKillsHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setRemainingKills } = React.useContext(Game2Context);

    React.useEffect(() => {
        if (!roomId) return;

        const remainingKillsHandlerWithDependencies = handler({ setRemainingKills });
        remainingKillsHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setRemainingKills, socket]);
};
