import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { screenStateHandler, useScreenStateHandler } from '../../../domain/commonGameState/screen/screenStateHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { ScreenStateMessage } from '../../../domain/typeGuards/screenState';
import { MessageTypes } from '../../../utils/constants';

describe('screenStateHandler', () => {
    const roomId = 'ANES';
    const message: ScreenStateMessage = {
        type: MessageTypes.screenState,
        state: 'test',
    };

    it('when ScreenStateMessage is written, setScreenState should be called', async () => {
        const setScreenState = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = screenStateHandler({ setScreenState });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setScreenState).toHaveBeenCalledTimes(1);
    });
});

describe('useScreenStateHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const screenStateHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useScreenStateHandler(socket, screenStateHandler));

        expect(screenStateHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const screenStateHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useScreenStateHandler(socket, screenStateHandler));

        expect(screenStateHandler).toHaveBeenCalledTimes(0);
    });
});
