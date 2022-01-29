import { History } from 'history';
import React from 'react';

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
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const resetHandlerWithDependencies = handler({ history });
        resetHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
