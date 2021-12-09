import React from 'react';

import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../../contexts/PlayerContextProvider';
import { controllerPlayerDeadRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { PlayerDiedMessage, playerDiedTypeGuard } from '../../../typeGuards/game1/playerDied';

interface Dependencies {
    setPlayerDead: (val: boolean) => void;
    setPlayerRank: (val: number) => void;
}
export interface HandlePlayerDiedProps {
    data: PlayerDiedMessage;
    roomId: string;
}

export const diedHandler = messageHandler(playerDiedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { setPlayerDead, setPlayerRank } = dependencies;

    setPlayerDead(true);
    setPlayerRank(message.rank);
    history.push(controllerPlayerDeadRoute(roomId));
});

export const useDiedHandler = (socket: Socket, handler = diedHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPlayerRank } = React.useContext(PlayerContext);
    const { setPlayerDead } = React.useContext(Game1Context);

    React.useEffect(() => {
        if (!roomId) return;

        const diedHandlerWithDependencies = handler({ setPlayerDead, setPlayerRank });
        diedHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setPlayerDead, setPlayerRank, socket]);
};
