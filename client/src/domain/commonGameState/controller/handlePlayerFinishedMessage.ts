import React from 'react';

import { Game1Context } from '../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../contexts/GameContextProvider';
import { PlayerContext } from '../../../contexts/PlayerContextProvider';
import { controllerFinishedRoute } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { playerFinishedTypeGuard } from '../../typeGuards/game1/playerFinished';

interface Dependencies {
    setPlayerFinished: (val: boolean) => void;
    setPlayerRank: (val: number) => void;
    playerFinished: boolean;
}

export const playerFinishedHandler = messageHandler(
    playerFinishedTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        const { setPlayerFinished, setPlayerRank, playerFinished } = dependencies;

        if (!playerFinished) {
            setPlayerFinished(true);
            setPlayerRank(message.rank);

            const windmillTimeoutId = sessionStorage.getItem('windmillTimeoutId');
            if (windmillTimeoutId) {
                clearTimeout(Number(windmillTimeoutId));
                sessionStorage.removeItem('windmillTimeoutId');
            }

            history.push(controllerFinishedRoute(roomId));
        }
    }
);

export const usePlayerFinishedHandler = (socket: Socket, handler = playerFinishedHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setPlayerRank } = React.useContext(PlayerContext);
    const { setPlayerFinished, playerFinished } = React.useContext(Game1Context);

    React.useEffect(() => {
        if (!roomId) return;

        const playerFinishedHandlerWithDependencies = handler({
            setPlayerFinished,
            setPlayerRank,
            playerFinished,
        });

        playerFinishedHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
