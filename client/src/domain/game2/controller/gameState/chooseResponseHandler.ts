import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../../contexts/GameContextProvider';
import { controllerStealSheepRoute } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { chooseResponseTypeGuard } from '../../../typeGuards/game2/chooseResponse';

interface Dependencies {
    history: History;
}

export const chooseResponseHandler = messageHandler(chooseResponseTypeGuard, (message, dependencies: Dependencies) => {
    if (message.successful) {
        dependencies.history.push(controllerStealSheepRoute(message.roomId));
    }
});

export const useChooseResponseHandler = (socket: Socket, handler = chooseResponseHandler) => {
    const { roomId } = React.useContext(GameContext);
    React.useEffect(() => {
        if (!roomId) return;
        const chooseResponseHandlerWithDependencies = handler({ history });
        chooseResponseHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, socket]);
};
