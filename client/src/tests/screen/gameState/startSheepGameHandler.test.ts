import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import {
    startSheepGameHandler,
    useStartSheepGameHandler,
} from '../../../domain/game2/screen/gameState/startSheepGameHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { StartSheepGameMessage } from '../../../domain/typeGuards/startSheepGame';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('startSheepGameHandler', () => {
    const roomId = 'ANES';
    const message: StartSheepGameMessage = {
        type: MessageTypesGame2.startSheepGame,
        countdownTime: 3000,
    };

    it('when VoteForPhotoMessage is written, setSheepGameStarted should be called', async () => {
        const setSheepGameStarted = jest.fn();
        const history = createMemoryHistory();
        const socket = new InMemorySocketFake();

        const withDependencies = startSheepGameHandler({ setSheepGameStarted, history });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setSheepGameStarted).toHaveBeenCalledTimes(1);
    });
});

describe('useStartSheepGameHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const startSheepGameHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useStartSheepGameHandler(socket, startSheepGameHandler));

        expect(startSheepGameHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const startSheepGameHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useStartSheepGameHandler(socket, startSheepGameHandler));

        expect(startSheepGameHandler).toHaveBeenCalledTimes(0);
    });
});
