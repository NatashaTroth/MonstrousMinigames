import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    stunnablePlayersHandler,
    useStunnablePlayersHandler,
} from '../../../domain/game1/controller/gameState/stunnablePlayersHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { StunnablePlayersMessage } from '../../../domain/typeGuards/game1/stunnablePlayers';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('stunnablePlayersHandler', () => {
    const mockData: StunnablePlayersMessage = {
        type: MessageTypesGame1.stunnablePlayers,
        roomId: 'ABCD',
        stunnablePlayers: ['1', '2'],
    };

    it('handed setStunnablePlayers should be called', async () => {
        const setStunnablePlayers = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = stunnablePlayersHandler({
            setStunnablePlayers,
        });

        withDependencies(socket, mockData.roomId);

        await socket.emit(mockData);

        expect(setStunnablePlayers).toHaveBeenLastCalledWith(mockData.stunnablePlayers);
    });
});

describe('useStunnablePlayersHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const stunnablePlayersHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useStunnablePlayersHandler(socket, stunnablePlayersHandler));

        expect(stunnablePlayersHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const stunnablePlayersHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useStunnablePlayersHandler(socket, stunnablePlayersHandler));

        expect(stunnablePlayersHandler).toHaveBeenCalledTimes(0);
    });
});
