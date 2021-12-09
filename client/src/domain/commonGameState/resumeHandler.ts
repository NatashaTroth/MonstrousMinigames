import React from 'react';

import { GameContext } from '../../contexts/GameContextProvider';
import messageHandler from '../socket/messageHandler';
import { Socket } from '../socket/Socket';
import { resumedTypeGuard } from '../typeGuards/resumed';

interface Dependencies {
    setHasPaused: (val: boolean) => void;
}

export const resumeHandler = messageHandler(resumedTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setHasPaused(false);
});

export const useResumeHandler = (socket: Socket, handler = resumeHandler) => {
    const { roomId, setHasPaused } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const resumeHandlerWithDependencies = handler({
            setHasPaused,
        });

        resumeHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setHasPaused, socket]);
};
