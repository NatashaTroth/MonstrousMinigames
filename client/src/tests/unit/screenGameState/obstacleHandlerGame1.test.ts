import {
    approachingObstacleHandler,
    obstacleSkippedHandler,
    obstacleWillBeSolvedHandler,
} from '../../../domain/game1/screen/gameState/obstacleHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { ApproachingSolvableObstacleOnceMessage } from '../../../domain/typeGuards/game1/approachingSolvableObstacleOnceTypeGuard';
import { ObstacleSkippedMessage } from '../../../domain/typeGuards/game1/obstacleSkipped';
import { ObstacleWillBeSolvedMessage } from '../../../domain/typeGuards/game1/obstacleWillBeSolved';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('approachingObstacleHandler Game1', () => {
    const message: ApproachingSolvableObstacleOnceMessage = {
        type: MessageTypesGame1.approachingSolvableObstacleOnce,
        userId: '1',
        obstacleType: ObstacleTypes.stone,
        obstacleId: 1,
        distance: 1,
    };

    it('when message type is approachingSolvableObstacleOnce, handleApproachingObstacle pause should be called', async () => {
        const socket = new FakeInMemorySocket();
        const handleApproachingObstacle = jest.fn();

        const scene = {
            players: [
                {
                    player: { id: '1' },
                    handleApproachingObstacle,
                    destroyWarningIcon: jest.fn(),
                    handleObstacleSkipped: jest.fn(),
                },
            ],
        };

        const withDependencies = approachingObstacleHandler({ scene });

        withDependencies(socket);
        await socket.emit(message);

        expect(handleApproachingObstacle).toHaveBeenCalledTimes(1);
    });
});

describe('obstacleSkippedHandler Game1', () => {
    const message: ObstacleSkippedMessage = {
        type: MessageTypesGame1.obstacleSkipped,
        userId: '1',
        obstacleId: 1,
    };

    it('when message type is obstacleSkipped, handleObstacleSkipped pause should be called', async () => {
        const socket = new FakeInMemorySocket();
        const handleObstacleSkipped = jest.fn();

        const scene = {
            players: [
                {
                    player: { id: '1' },
                    handleApproachingObstacle: jest.fn(),
                    destroyWarningIcon: jest.fn(),
                    handleObstacleSkipped,
                },
            ],
        };

        const withDependencies = obstacleSkippedHandler({ scene });

        withDependencies(socket);
        await socket.emit(message);

        expect(handleObstacleSkipped).toHaveBeenCalledTimes(1);
    });
});

describe('obstacleWillBeSolvedHandler Game1', () => {
    const message: ObstacleWillBeSolvedMessage = {
        type: MessageTypesGame1.obstacleWillBeSolved,
        userId: '1',
        obstacleId: 1,
    };

    it('when message type is obstacleWillBeSolved, destroyWarningIcon pause should be called', async () => {
        const socket = new FakeInMemorySocket();
        const destroyWarningIcon = jest.fn();

        const scene = {
            players: [
                {
                    player: { id: '1' },
                    handleApproachingObstacle: jest.fn(),
                    handleObstacleSkipped: jest.fn(),
                    destroyWarningIcon,
                },
            ],
        };

        const withDependencies = obstacleWillBeSolvedHandler({ scene });

        withDependencies(socket);
        await socket.emit(message);

        expect(destroyWarningIcon).toHaveBeenCalledTimes(1);
    });
});
