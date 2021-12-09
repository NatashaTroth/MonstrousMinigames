import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    connectedUsersHandler,
    useConnectedUsersHandler,
} from '../../../domain/commonGameState/screen/connectedUsersHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ConnectedUsersMessage } from '../../../domain/typeGuards/connectedUsers';
import { MessageTypes } from '../../../utils/constants';

describe('connectedUsersHandler', () => {
    it('handed setConnectedUsers should be called with handed data', async () => {
        const setConnectedUsers = jest.fn();
        const socket = new InMemorySocketFake();
        const roomId = 'ADES';

        const data: ConnectedUsersMessage = { type: MessageTypes.connectedUsers, users: [] };

        const withDependencies = connectedUsersHandler({
            setConnectedUsers,
        });

        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(setConnectedUsers).toHaveBeenCalledWith(data.users);
    });
});

describe('useConnectedUsersHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const connectedUsersHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useConnectedUsersHandler(socket, connectedUsersHandler));

        expect(connectedUsersHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const connectedUsersHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useConnectedUsersHandler(socket, connectedUsersHandler));

        expect(connectedUsersHandler).toHaveBeenCalledTimes(0);
    });
});
