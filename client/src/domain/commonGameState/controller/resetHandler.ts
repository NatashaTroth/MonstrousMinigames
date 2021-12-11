import { History } from 'history';
import React from 'react';

import { Game3Context } from '../../../contexts/game3/Game3ContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import { controllerLobbyRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { resetTypeGuard } from '../../typeGuards/reset';

interface Dependencies {
    history: History;
    resetController: () => void;
}

export const resetHandler = messageHandler(resetTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { resetController, history } = dependencies;
    resetController();
    history.push(controllerLobbyRoute(roomId));
});

export const useResetHandler = (socket: Socket, handler = resetHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { resetGame3 } = React.useContext(Game3Context);
    const { resetPlayer } = React.useContext(PlayerContext);

    React.useEffect(() => {
        if (!roomId) return;

        const resetHandlerWithDependencies = handler({
            resetController: () => {
                resetGame3(), resetPlayer();
            },
            history,
        });

        resetHandlerWithDependencies(socket, roomId);
    }, [handler, resetGame3, resetPlayer, roomId, socket]);
};
