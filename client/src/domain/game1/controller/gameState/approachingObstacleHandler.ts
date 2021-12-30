import React from 'react';

import { Game1Context } from '../../../../contexts/game1/Game1ContextProvider';
import { GameContext } from '../../../../contexts/GameContextProvider';
import { Obstacle } from '../../../../contexts/PlayerContextProvider';
import messageHandler from '../../../socket/messageHandler';
import { Socket } from '../../../socket/Socket';
import { approachingSolvableObstacleTypeGuard } from '../../../typeGuards/game1/approachingSolvableObstacleTypeGuard';

interface Dependencies {
    setEarlySolvableObstacle: (value: undefined | Obstacle) => void;
}

export const approachingObstacleHandler = messageHandler(
    approachingSolvableObstacleTypeGuard,
    (message, dependencies: Dependencies) => {
        const { distance, obstacleId, obstacleType } = message;

        if (distance < 10) {
            dependencies.setEarlySolvableObstacle(undefined);
            return;
        }

        dependencies.setEarlySolvableObstacle({
            id: obstacleId,
            type: obstacleType,
            distance: distance,
        });
    }
);

export const useApproachingObstacleHandler = (socket: Socket, handler = approachingObstacleHandler) => {
    const { roomId } = React.useContext(GameContext);
    const { setEarlySolvableObstacle } = React.useContext(Game1Context);

    React.useEffect(() => {
        if (!roomId) return;

        const approachingObstacleHandlerWithDependencies = handler({ setEarlySolvableObstacle });
        approachingObstacleHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setEarlySolvableObstacle, socket]);
};
