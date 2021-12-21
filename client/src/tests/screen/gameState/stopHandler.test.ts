import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { stopHandler, useStopHandler } from '../../../domain/commonGameState/screen/stopHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStoppedMessage } from '../../../domain/typeGuards/stopped';
import { MessageTypes } from '../../../utils/constants';
import { screenLobbyRoute } from '../../../utils/routes';

describe('stopHandler', () => {
    const roomId = '1234';
    const message: GameHasStoppedMessage = {
        type: MessageTypes.gameHasStopped,
    };

    it('when message type is gameHasStopped, history push should be called', async () => {
        const history = createMemoryHistory();
        const socket = new FakeInMemorySocket();

        const setPlayCount = jest.fn();
        const playCount = 0;

        const withDependencies = stopHandler({ history, setPlayCount, playCount });

        withDependencies(socket, roomId);
        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
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
