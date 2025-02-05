import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { stopHandler, useStopHandler } from '../../../domain/commonGameState/controller/stopHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStoppedMessage } from '../../../domain/typeGuards/stopped';
import { MessageTypes } from '../../../utils/constants';
import { controllerLobbyRoute } from '../../../utils/routes';

describe('stopHandler', () => {
    const roomId = 'ADFS';
    const mockData: GameHasStoppedMessage = {
        type: MessageTypes.gameHasStopped,
    };

    it('when GameHasStoppedMessage is emitted, it should be reroutet to lobby', async () => {
        const history = createMemoryHistory();
        const socket = new FakeInMemorySocket();

        const withDependencies = stopHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(history.location).toHaveProperty('pathname', controllerLobbyRoute(roomId));
    });
});

describe('useStopHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const stopHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useStopHandler(socket, stopHandler));

        expect(stopHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const stopHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useStopHandler(socket, stopHandler));

        expect(stopHandler).toHaveBeenCalledTimes(0);
    });
});
