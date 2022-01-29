import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import { screenLobbyRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { stoppedTypeGuard } from '../../typeGuards/stopped';

interface Dependencies {
    history: History;
}

export const stopHandler = messageHandler(stoppedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.history.push(screenLobbyRoute(roomId));
});

export const useStopHandler = (socket: Socket, handler = stopHandler) => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;
        const stopHandlerWithDependencies = handler({ history });
        stopHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
