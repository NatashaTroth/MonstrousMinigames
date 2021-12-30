import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { pauseHandler, usePauseHandler } from '../../../domain/commonGameState/pauseHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasPausedMessage } from '../../../domain/typeGuards/paused';
import { MessageTypes } from '../../../utils/constants';

describe('pauseHandler', () => {
    const mockData: GameHasPausedMessage = {
        type: MessageTypes.gameHasPaused,
    };

    it('when GameHasPausedMessage is emitted, handed setHasPause should be called with true', async () => {
        const setHasPaused = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = pauseHandler({ setHasPaused });
        withDependencies(socket, 'SSWG');

        await socket.emit(mockData);

        expect(setHasPaused).toHaveBeenCalledWith(true);
    });
});

describe('usePauseHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const pauseHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => usePauseHandler(socket, pauseHandler));

        expect(pauseHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const pauseHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => usePauseHandler(socket, pauseHandler));

        expect(pauseHandler).toHaveBeenCalledTimes(0);
    });
});
