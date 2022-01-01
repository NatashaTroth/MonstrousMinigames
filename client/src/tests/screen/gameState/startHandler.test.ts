import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { GameNames } from '../../../config/games';
import { startHandler, useStartHandler } from '../../../domain/commonGameState/screen/startHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStartedMessage } from '../../../domain/typeGuards/game1/started';
import { MessageTypes } from '../../../utils/constants';

describe('startHandler', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();
    const game = GameNames.game3;

    const message: GameHasStartedMessage = {
        type: MessageTypes.gameHasStarted,
        game,
        countdownTime: 3000,
    };

    it('handed setGameStarted should be called with true', async () => {
        const socket = new FakeInMemorySocket();
        const withDependencies = startHandler({ setGameStarted, history, setCountdownTime: jest.fn() });

        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });
});

describe('useStartHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const startHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useStartHandler(socket, startHandler));

        expect(startHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const startHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useStartHandler(socket, startHandler));

        expect(startHandler).toHaveBeenCalledTimes(0);
    });
});
