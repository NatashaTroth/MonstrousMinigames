import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerPlayerStunnedRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { playerStunnedTypeGuard } from '../../../typeGuards/game1/playerStunned';

interface Dependencies {
    history: History;
}
export const stunnedHandler = messageHandler(playerStunnedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.history.push(controllerPlayerStunnedRoute(roomId));
});

export const useStunnedHandler = (socket: Socket, handler = stunnedHandler) => {
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const stunnedHandlerWithDependencies = handler({ history });

        stunnedHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
