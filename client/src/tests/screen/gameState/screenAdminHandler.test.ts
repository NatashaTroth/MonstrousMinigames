import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { screenAdminHandler, useScreenAdminHandler } from '../../../domain/commonGameState/screen/screenAdminHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { ScreenAdminMessage } from '../../../domain/typeGuards/screenAdmin';
import { MessageTypes } from '../../../utils/constants';

describe('screenAdminHandler', () => {
    const roomId = 'ANES';
    const message: ScreenAdminMessage = {
        type: MessageTypes.screenAdmin,
        isAdmin: true,
    };

    it('when ScreenAdminMessage is written, setScreenAdmin should be called', async () => {
        const setScreenAdmin = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = screenAdminHandler({ setScreenAdmin });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setScreenAdmin).toHaveBeenCalledTimes(1);
    });
});

describe('useScreenAdminHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const screenAdminHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useScreenAdminHandler(socket, screenAdminHandler));

        expect(screenAdminHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const screenAdminHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useScreenAdminHandler(socket, screenAdminHandler));

        expect(screenAdminHandler).toHaveBeenCalledTimes(0);
    });
});
