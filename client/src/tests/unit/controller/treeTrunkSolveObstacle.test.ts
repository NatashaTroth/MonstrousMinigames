/* eslint-disable simple-import-sort/imports */
import 'jest-styled-components';
import { cleanup } from '@testing-library/react';

import { solveObstacle } from '../../../domain/game1/controller/components/obstacles/TreeTrunk';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

afterEach(cleanup);

describe('treeTrunk solveObstacle', () => {
    it('obstacleSolved should be emitted to socket', () => {
        const controllerSocket = new FakeInMemorySocket();
        const obstacle = { id: 1, type: ObstacleTypes.treeStump };

        solveObstacle({
            controllerSocket,
            obstacle,
            setObstacle: jest.fn(),
            setShowInstructions: jest.fn(),
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
