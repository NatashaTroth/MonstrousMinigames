import { Obstacle } from '../../../../contexts/PlayerContextProvider';
import messageHandler from '../../../socket/messageHandler';
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
