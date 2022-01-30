import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { screenStateTypeGuard } from '../../typeGuards/screenState';

interface Dependencies {
    setScreenState: (val: string) => void;
}

export const screenStateHandler = messageHandler(screenStateTypeGuard, (message, dependencies: Dependencies) => {
    const screenState = message.game ? `${message.state}/${message.game}` : message.state;
    dependencies.setScreenState(screenState);
});

export const useScreenStateHandler = (socket: Socket, handler = screenStateHandler) => {
    const { setScreenState, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const screenStateHandlerWithDependencies = handler({ setScreenState });

        screenStateHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
