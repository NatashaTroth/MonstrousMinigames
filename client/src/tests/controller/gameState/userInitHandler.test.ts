import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { userInitHandler, useUserInitHandler } from '../../../domain/commonGameState/controller/userInitHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { UserInitMessage } from '../../../domain/typeGuards/userInit';
import { MessageTypes } from '../../../utils/constants';

it('when UserInitMessage was written, handed persistUser is executed', async () => {
    const roomId = 'ABDE';
    const message: UserInitMessage = {
        name: 'Mock',
        type: MessageTypes.userInit,
        userId: '1',
        roomId,
        isAdmin: true,
        number: 1,
        ready: true,
    };

    const persistUser = jest.fn();

    const dependencies = {
        setPlayerNumber: jest.fn(),
        setName: jest.fn(),
        setUserId: jest.fn(),
        setReady: jest.fn(),
        persistUser,
    };

    const userInitHandlerWithDependencies = userInitHandler(dependencies);

    const socket = new InMemorySocketFake();

    userInitHandlerWithDependencies(socket, roomId);

    await socket.emit(message);

    expect(persistUser).toHaveBeenCalledTimes(1);
});

describe('useUserInitHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const userInitHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useUserInitHandler(socket, userInitHandler));

        expect(userInitHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const userInitHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useUserInitHandler(socket, userInitHandler));

        expect(userInitHandler).toHaveBeenCalledTimes(0);
    });
});
