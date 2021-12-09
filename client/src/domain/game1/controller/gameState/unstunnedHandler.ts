import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerGame1Route } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { playerUnstunnedTypeGuard } from '../../../typeGuards/game1/playerUnstunned';

interface Dependencies {
    history: History;
}

export const unstunnedHandler = messageHandler(
    playerUnstunnedTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        dependencies.history.push(controllerGame1Route(roomId));
    }
);

export const useUnstunnedHandler = (socket: Socket, handler = unstunnedHandler) => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const unstunnedHandlerWithDependencies = handler({ history });
        unstunnedHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, socket]);
};
