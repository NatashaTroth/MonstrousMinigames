import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { unstunnedHandler, useUnstunnedHandler } from '../../../domain/game1/controller/gameState/unstunnedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { PlayerUnstunnedMessage } from '../../../domain/typeGuards/game1/playerUnstunned';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('unstunnedHandler', () => {
    const roomId = '1234';
    const message: PlayerUnstunnedMessage = {
        type: MessageTypesGame1.playerUnstunned,
    };

    it('when PlayerUnstunnedMessage is written, history push should be called with handed roomId', async () => {
        const history = createMemoryHistory();
        const socket = new FakeInMemorySocket();

        const withDependencies = unstunnedHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/game1`);
    });
});

describe('useUnstunnedHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const unstunnedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useUnstunnedHandler(socket, unstunnedHandler));

        expect(unstunnedHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const unstunnedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useUnstunnedHandler(socket, unstunnedHandler));

        expect(unstunnedHandler).toHaveBeenCalledTimes(0);
    });
});
