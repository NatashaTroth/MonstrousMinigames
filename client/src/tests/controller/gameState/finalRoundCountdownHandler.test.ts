import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    finalRoundCountdownHandler,
    useFinalRoundCountdownHandler,
} from '../../../domain/game3/controller/gameState/finalRoundCountdownHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { FinalRoundCountdownMessage } from '../../../domain/typeGuards/game3/finalRoundCountdown';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('finalRoundCountdownHandler', () => {
    const roomId = 'ANES';
    const message: FinalRoundCountdownMessage = {
        type: MessageTypesGame3.finalRoundCountdown,
        roomId,
        countdownTime: 3000,
    };

    it('when FinalRoundCountdownMessage is written, setFinalRoundCountdownTime should be called', async () => {
        const setFinalRoundCountdownTime = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = finalRoundCountdownHandler({ setFinalRoundCountdownTime });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setFinalRoundCountdownTime).toHaveBeenCalledTimes(1);
    });
});

describe('useFinalRoundCountdownHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const finalRoundCountdownHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useFinalRoundCountdownHandler(socket, finalRoundCountdownHandler));

        expect(finalRoundCountdownHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const finalRoundCountdownHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useFinalRoundCountdownHandler(socket, finalRoundCountdownHandler));

        expect(finalRoundCountdownHandler).toHaveBeenCalledTimes(0);
    });
});
