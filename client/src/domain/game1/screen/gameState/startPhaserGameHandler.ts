import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../../contexts/GameContextProvider';
import { screenGame1Route } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { startPhaserGameTypeGuard } from '../../../typeGuards/startPhaserGame';

interface Dependencies {
    setGameStarted: (val: boolean) => void;
    history: History;
}

export const startPhaserGameHandler = messageHandler(
    startPhaserGameTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        const { setGameStarted, history } = dependencies;
        setGameStarted(true);
        document.body.style.overflow = 'hidden';
        history.push(screenGame1Route(roomId));
    }
);

export const useStartPhaserGameHandler = (socket: Socket, handler = startPhaserGameHandler) => {
    const { setGameStarted, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const startPhaserGameHandlerWithDependencies = handler({ setGameStarted, history });
        startPhaserGameHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setGameStarted, socket]);
};
