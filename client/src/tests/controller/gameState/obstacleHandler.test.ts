import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { obstacleHandler, useObstacleHandler } from '../../../domain/game1/controller/gameState/obstacleHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ObstacleMessage } from '../../../domain/typeGuards/game1/obstacle';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('obstacleHandler', () => {
    const roomId = '1234';
    const message: ObstacleMessage = {
        type: MessageTypesGame1.obstacle,
        obstacleType: ObstacleTypes.spider,
        obstacleId: 1,
    };

    it('when ObstacleMessage is written, handed setObstacle should be called', async () => {
        const setObstacle = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = obstacleHandler({
            setObstacle,
        });

        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setObstacle).toHaveBeenCalledTimes(1);
    });
});

describe('useObstacleHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const obstacleHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useObstacleHandler(socket, obstacleHandler));

        expect(obstacleHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const obstacleHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useObstacleHandler(socket, obstacleHandler));

        expect(obstacleHandler).toHaveBeenCalledTimes(0);
    });
});
