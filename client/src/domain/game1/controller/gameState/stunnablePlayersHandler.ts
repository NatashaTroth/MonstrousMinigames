import React from 'react';

import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { stunnablePlayersTypeGuard } from '../../../typeGuards/game1/stunnablePlayers';

interface Dependencies {
    setStunnablePlayers: (val: string[]) => void;
}

export const stunnablePlayersHandler = messageHandler(
    stunnablePlayersTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.setStunnablePlayers(message.stunnablePlayers);
    }
);

export const useStunnablePlayersHandler = (socket: Socket, handler = stunnablePlayersHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setStunnablePlayers } = React.useContext(Game1Context);

    React.useEffect(() => {
        if (!roomId) return;

        const stunnablePlayersHandlerWithDependencies = handler({ setStunnablePlayers });
        stunnablePlayersHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
