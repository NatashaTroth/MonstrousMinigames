import React from 'react';

import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { localStorage } from '../../storage/LocalStorage';
import { sessionStorage } from '../../storage/SessionStorage';
import { UserInitMessage, userInitTypeGuard } from '../../typeGuards/userInit';
import { persistUser } from '../../user/persistUser';

interface Dependencies {
    persistUser: (data: UserInitMessage) => void;
    setPlayerNumber: (val: number) => void;
    setName: (val: string) => void;
    setUserId: (val: string) => void;
    setReady: (val: boolean) => void;
    setScreenState: (val: string) => void;
}

export const userInitHandler = messageHandler(userInitTypeGuard, (message, dependencies: Dependencies) => {
    const { setPlayerNumber, setName, setUserId, setReady, persistUser, setScreenState } = dependencies;

    setName(message.name);
    setPlayerNumber(message.number);
    setUserId(message.userId);
    setReady(message.ready);
    setScreenState(message.screenState);

    persistUser(message);
});

export const useUserInitHandler = (socket: Socket, handler = userInitHandler) => {
    const { setPlayerNumber, setName, setUserId, setReady } = React.useContext(PlayerContext);
    const { roomId, setScreenState } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const persistUserWithDependencies = persistUser({
            localStorage,
            sessionStorage,
        });

        const userInitHandlerWithDependencies = handler({
            setPlayerNumber,
            setName,
            setUserId,
            setReady,
            persistUser: persistUserWithDependencies,
            setScreenState,
        });

        userInitHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
