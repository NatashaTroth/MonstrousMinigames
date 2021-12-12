import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    exceededMaxChaserPushesHandler,
    useExceededMaxChaserPushesHandler,
} from '../../../domain/game1/controller/gameState/exceededMaxChaserPushesHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { ExceededMaxChaserPushesMessage } from '../../../domain/typeGuards/game1/exceededMaxChaserPushes';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('exceededMaxChaserPushesHandler', () => {
    const mockData: ExceededMaxChaserPushesMessage = {
        type: MessageTypesGame1.exceededNumberOfChaserPushes,
    };

    it('handed setExceeded should be called', async () => {
        const setExceededChaserPushes = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = exceededMaxChaserPushesHandler({
            setExceededChaserPushes,
        });

        withDependencies(socket, 'PSVS');

        await socket.emit(mockData);

        expect(setExceededChaserPushes).toHaveBeenCalledWith(true);
    });
});

describe('useExceededMaxChaserPushesHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const exceededMaxChaserPushesHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useExceededMaxChaserPushesHandler(socket, exceededMaxChaserPushesHandler));

        expect(exceededMaxChaserPushesHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const exceededMaxChaserPushesHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useExceededMaxChaserPushesHandler(socket, exceededMaxChaserPushesHandler));

        expect(exceededMaxChaserPushesHandler).toHaveBeenCalledTimes(0);
    });
});
