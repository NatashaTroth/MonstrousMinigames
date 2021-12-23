import { History } from 'history';
import React from 'react';

import { Game3Context } from '../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { screenLobbyRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { resetTypeGuard } from '../../typeGuards/reset';

interface Dependencies {
    history: History;
}

export const resetHandler = messageHandler(resetTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.history.push(screenLobbyRoute(roomId));
});

export const useResetHandler = (socket: Socket, handler = resetHandler) => {
    const { roomId, resetGame } = React.useContext(GameContext);
    const { resetGame3 } = React.useContext(Game3Context);

    React.useEffect(() => {
        if (!roomId) return;

        const resetHandlerWithDependencies = handler({ history });
        resetHandlerWithDependencies(socket, roomId);
    }, [handler, resetGame, resetGame3, roomId, socket]);
};
