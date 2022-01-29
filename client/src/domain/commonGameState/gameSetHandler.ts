import React from 'react';

import { GameNames } from '../../config/games';
import { GameContext } from '../../contexts/GameContextProvider';
import messageHandler from '../socket/messageHandler';
import { Socket } from '../socket/Socket';
import { gameSetTypeGuard } from '../typeGuards/gameSet';

interface Dependencies {
    setChosenGame: (val: GameNames) => void;
}

export const gameSetHandler = messageHandler(gameSetTypeGuard, (message, dependencies: Dependencies) => {
    dependencies.setChosenGame(message.game);
});

export const useGameSetHandler = (socket: Socket, handler = gameSetHandler) => {
    const { roomId, setChosenGame } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const gameSetHandlerWithDependencies = handler({
            setChosenGame,
        });

        gameSetHandlerWithDependencies(socket, roomId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, socket]);
};
