import React from 'react';

import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { Obstacle } from '../../../../contexts/PlayerContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { ObstacleMessage, obstacleTypeGuard } from '../../../typeGuards/game1/obstacle';

interface Dependencies {
    setObstacle: (roomId: string | undefined, obstacle: undefined | Obstacle) => void;
}
export interface HandleObstacleMessageProps {
    data: ObstacleMessage;
    roomId: string;
}

export const obstacleHandler = messageHandler(obstacleTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.setObstacle(roomId, {
        type: message.obstacleType,
        id: message.obstacleId,
        numberTrashItems: message.numberTrashItems,
        trashType: message.trashType,
    });
});

export const useObstacleHandler = (socket: Socket, handler = obstacleHandler) => {
    const { setObstacle } = React.useContext(Game1Context);
    const { roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const obstacleHandlerWithDependencies = handler({ setObstacle });
        obstacleHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setObstacle, socket]);
};
