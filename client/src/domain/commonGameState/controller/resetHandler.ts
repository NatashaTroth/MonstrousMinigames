import { History } from 'history';
import React from 'react';

import { Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import { Game2Context } from '../../../contexts/game2/Game2ContextProvider';
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
    const { resetGame1 } = React.useContext(Game1Context);
    const { resetGame2 } = React.useContext(Game2Context);
    const { resetGame3 } = React.useContext(Game3Context);
    const { resetPlayer } = React.useContext(PlayerContext);

    React.useEffect(() => {
        if (!roomId) return;

        const resetHandlerWithDependencies = handler({
            resetController: () => {
                resetGame1();
                resetGame2();
                resetGame3();
                resetPlayer();
            },
            history,
        });

        resetHandlerWithDependencies(socket, roomId);
    }, [handler, resetGame1, resetGame2, resetGame3, resetPlayer, roomId, socket]);
};
