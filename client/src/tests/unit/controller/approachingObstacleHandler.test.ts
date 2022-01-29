import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    approachingObstacleHandler,
    useApproachingObstacleHandler,
} from '../../../domain/game1/controller/gameState/approachingObstacleHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { ApproachingSolvableObstacleMessage } from '../../../domain/typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('approachingObstacleHandler', () => {
    const data: ApproachingSolvableObstacleMessage = {
        type: MessageTypesGame1.approachingSolvableObstacle,
        obstacleType: ObstacleTypes.spider,
        obstacleId: 1,
        distance: 200,
    };
    const roomId = 'DLEA';

    const setEarlySolvableObstacle = jest.fn();

    it('when message type is approachingSolvableObstacle, handed setEarlySolvableObstacle should be called', async () => {
        const socket = new FakeInMemorySocket();

        const withDependencies = approachingObstacleHandler({
            setEarlySolvableObstacle,
        });

        withDependencies(socket, roomId);

        socket.emit(data);

        expect(setEarlySolvableObstacle).toHaveBeenCalledTimes(1);
    });

    it('when data distance is less than 10, handed setEarlySolvableObstacle should be called with undefined', async () => {
        const setEarlySolvableObstacle = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = approachingObstacleHandler({
            setEarlySolvableObstacle,
        });

        withDependencies(socket, roomId);

        socket.emit({
            ...data,
            distance: 5,
        });

        expect(setEarlySolvableObstacle).toHaveBeenCalledWith(undefined);
    });
});

describe('useApproachingObstacleHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const approachingObstacleHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useApproachingObstacleHandler(socket, approachingObstacleHandler));

        expect(approachingObstacleHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const approachingObstacleHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useApproachingObstacleHandler(socket, approachingObstacleHandler));

        expect(approachingObstacleHandler).toHaveBeenCalledTimes(0);
    });
});
