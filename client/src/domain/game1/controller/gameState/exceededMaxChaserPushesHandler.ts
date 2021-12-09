import React from 'react';

import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { exceededMaxChaserPushesTypeGuard } from '../../../typeGuards/game1/exceededMaxChaserPushes';

interface Dependencies {
    setExceededChaserPushes: (val: boolean) => void;
}

export const exceededMaxChaserPushesHandler = messageHandler(
    exceededMaxChaserPushesTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setExceededChaserPushes(true);
    }
);

export const useExceededMaxChaserPushesHandler = (socket: Socket, handler = exceededMaxChaserPushesHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setExceededChaserPushes } = React.useContext(Game1Context);

    React.useEffect(() => {
        if (!roomId) return;

        const exceededMaxChaserPushesHandlerWithDependencies = handler({
            setExceededChaserPushes,
        });

        exceededMaxChaserPushesHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setExceededChaserPushes, socket]);
};
