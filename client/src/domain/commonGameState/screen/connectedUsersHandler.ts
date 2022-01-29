import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';

interface Dependencies {
    setConnectedUsers: (users: User[]) => void;
}

export const connectedUsersHandler = messageHandler(connectedUsersTypeGuard, (message, dependencies: Dependencies) => {
    if (message.users) {
        dependencies.setConnectedUsers(message.users);
    }
});

export const useConnectedUsersHandler = (socket: Socket, handler = connectedUsersHandler) => {
    const { roomId, setConnectedUsers } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const connectedUsersHandlerWithDependencies = handler({ setConnectedUsers });
        connectedUsersHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
