import messageHandler from '../../../socket/messageHandler';
import { approachingSolvableObstacleOnceTypeGuard } from '../../../typeGuards/game1/approachingSolvableObstacleOnceTypeGuard';
import { obstacleSkippedTypeGuard } from '../../../typeGuards/game1/obstacleSkipped';
import { obstacleWillBeSolvedTypeGuard } from '../../../typeGuards/game1/obstacleWillBeSolved';

interface Dependencies {
    players: Array<{
        player: {
            id: string;
        };
        handleApproachingObstacle: () => void;
        handleObstacleSkipped: () => void;
        destroyWarningIcon: () => void;
    }>;
}

export const approachingObstacleHandler = messageHandler(
    approachingSolvableObstacleOnceTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.players.find(player => player.player.id === message.userId)?.handleApproachingObstacle();
    }
);

export const obstacleSkippedHandler = messageHandler(
    obstacleSkippedTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.players.find(player => player.player.id === message.userId)?.handleObstacleSkipped();
    }
);

export const obstacleWillBeSolvedHandler = messageHandler(
    obstacleWillBeSolvedTypeGuard,
    (message, dependencies: Dependencies) => {
        dependencies.players.find(player => player.player.id === message.userId)?.destroyWarningIcon();
    }
);
