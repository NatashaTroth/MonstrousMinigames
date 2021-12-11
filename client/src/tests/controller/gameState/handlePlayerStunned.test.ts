import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { stunnedHandler, useStunnedHandler } from '../../../domain/game1/controller/gameState/stunnedHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { PlayerStunnedMessage } from '../../../domain/typeGuards/game1/playerStunned';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('stunnedHandler', () => {
    const roomId = '1234';
    const message: PlayerStunnedMessage = {
        type: MessageTypesGame1.playerStunned,
    };

    it('when PlayerStunnedMessage is written, history push should be called with handed roomId', async () => {
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = stunnedHandler({ history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(history.location).toHaveProperty('pathname', `/controller/${roomId}/stunned`);
    });
});

describe('useStunnedHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const stunnedHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useStunnedHandler(socket, stunnedHandler));

        expect(stunnedHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const stunnedHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useStunnedHandler(socket, stunnedHandler));

        expect(stunnedHandler).toHaveBeenCalledTimes(0);
    });
});
