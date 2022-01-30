import { solveObstacle } from '../../../domain/game1/controller/components/obstacles/Spider';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('spider solveObstacle', () => {
    it('obstacleSolved should be emitted to socket', () => {
        const controllerSocket = new FakeInMemorySocket();
        const obstacle = { id: 1, type: ObstacleTypes.spider };

        solveObstacle({
            controllerSocket,
            obstacle,
            setObstacle: jest.fn(),
            clearTimeout: jest.fn(),
            handleSkip: setTimeout(() => {
                // do nothing
            }, 1000),
            roomId: 'ABCD',
        });

        expect(controllerSocket.emitedVals).toStrictEqual([
            {
                type: MessageTypesGame1.obstacleSolved,
                obstacleId: obstacle.id,
            },
        ]);
    });
});
