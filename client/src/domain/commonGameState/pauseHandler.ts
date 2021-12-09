import React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import messageHandler from '../socket/messageHandler';
import { Socket } from '../socket/Socket';
import { pausedTypeGuard } from '../typeGuards/paused';

interface Dependencies {
    setHasPaused: (val: boolean) => void;
}

export const pauseHandler = messageHandler(pausedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setHasPaused(true);
});

export const usePauseHandler = (socket: Socket, handler = pauseHandler) => {
    const { roomId, setHasPaused } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const pausedHandlerWithDependencies = handler({
            setHasPaused,
        });

        pausedHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setHasPaused, socket]);
};
