import React from 'react';

import { defaultAvailableCharacters } from '../../../config/characters';
import { GameContext } from '../../../contexts/GameContextProvider';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { connectedUsersTypeGuard, User } from '../../typeGuards/connectedUsers';

interface Dependencies {
    setAvailableCharacters: (val: number[]) => void;
    setConnectedUsers: (val: User[]) => void;
}
export const connectedUsersHandler = messageHandler(connectedUsersTypeGuard, (message, dependencies: Dependencies) => {
    const usedCharacters = message.users?.map(user => user.characterNumber) || [];
    const availableCharacters = defaultAvailableCharacters.filter(character => !usedCharacters.includes(character));

    dependencies.setAvailableCharacters(availableCharacters);
    dependencies.setConnectedUsers(message.users || []);
});

export const useConnectedUsersHandler = (socket: Socket, handler = connectedUsersHandler) => {
    const { setAvailableCharacters, setConnectedUsers, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const connectedUserHandlerWithDependencies = handler({
            setAvailableCharacters,
            setConnectedUsers,
        });

        connectedUserHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
