import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    remainingKillsHandler,
    useRemainingKillsHandler,
} from '../../../domain/game2/controller/gameState/remainingKillsHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { RemainingKillsMessage } from '../../../domain/typeGuards/game2/remainingKills';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('remainingKillsHandler', () => {
    const roomId = 'ANES';
    const message: RemainingKillsMessage = {
        type: MessageTypesGame2.remainingKills,
        remainingKills: 2,
    };

    it('when RemainingKillsMessage is written, setRemainingKills should be called', async () => {
        const setRemainingKills = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = remainingKillsHandler({ setRemainingKills });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setRemainingKills).toHaveBeenCalledTimes(1);
    });
});

describe('useRemainingKillsHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const remainingKillsHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useRemainingKillsHandler(socket, remainingKillsHandler));

        expect(remainingKillsHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const remainingKillsHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useRemainingKillsHandler(socket, remainingKillsHandler));

        expect(remainingKillsHandler).toHaveBeenCalledTimes(0);
    });
});
