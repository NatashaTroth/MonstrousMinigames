import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { resetHandler, useResetHandler } from '../../../domain/commonGameState/screen/resetHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResetMessage } from '../../../domain/typeGuards/reset';
import { MessageTypes } from '../../../utils/constants';
import { screenLobbyRoute } from '../../../utils/routes';

describe('resetHandler', () => {
    const roomId = '1234';
    const message: GameHasResetMessage = {
        type: MessageTypes.gameHasReset,
    };

    it('when message type is gameHasReset, history push should be called', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = resetHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', screenLobbyRoute(roomId));
    });
});

describe('useResetHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const resetHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useResetHandler(socket, resetHandler));

        expect(resetHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const resetHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useResetHandler(socket, resetHandler));

        expect(resetHandler).toHaveBeenCalledTimes(0);
    });
});
