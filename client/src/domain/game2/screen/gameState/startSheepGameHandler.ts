import { History } from 'history';
import React from 'react';

import { GameContext } from '../../../../contexts/GameContextProvider';
import { screenGame2Route } from '../../../../utils/routes';
import history from '../../../history/history';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { startSheepGameTypeGuard } from '../../../typeGuards/startSheepGame';

interface Dependencies {
    setSheepGameStarted: (val: boolean) => void;
    history: History;
}

export const startSheepGameHandler = messageHandler(
    startSheepGameTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        const { setSheepGameStarted, history } = dependencies;

        setSheepGameStarted(true);
        document.body.style.overflow = 'hidden';
        history.push(screenGame2Route(roomId));
    }
);

export const useStartSheepGameHandler = (socket: Socket, handler = startSheepGameHandler) => {
    const { setSheepGameStarted, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const startSheepGameHandlerWithDependencies = handler({ setSheepGameStarted, history });

        startSheepGameHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setSheepGameStarted, socket]);
};
