import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { resetHandler, useResetHandler } from '../../../domain/commonGameState/controller/resetHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResetMessage } from '../../../domain/typeGuards/reset';
import { MessageTypes } from '../../../utils/constants';

describe('resetHandler', () => {
    const roomId = '1234';
    const message: GameHasResetMessage = {
        type: MessageTypes.gameHasReset,
    };

    it('when GameHasResetMessage is emitted, history push should be called with handed roomId', async () => {
        const history = createMemoryHistory();
        const resetController = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = resetHandler({ history, resetController });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/lobby`);
    });
});

describe('useResetHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const resetHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useResetHandler(socket, resetHandler));

        expect(resetHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const resetHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useResetHandler(socket, resetHandler));

        expect(resetHandler).toHaveBeenCalledTimes(0);
    });
});
