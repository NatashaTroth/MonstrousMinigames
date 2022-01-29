import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { screenAdminTypeGuard } from '../../typeGuards/screenAdmin';

interface Dependencies {
    setScreenAdmin: (val: boolean) => void;
}

export const screenAdminHandler = messageHandler(screenAdminTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setScreenAdmin(message.isAdmin);
});

export const useScreenAdminHandler = (socket: Socket, handler = screenAdminHandler) => {
    const { setScreenAdmin, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const adminHandlerWithDependencies = handler({ setScreenAdmin });
        adminHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
