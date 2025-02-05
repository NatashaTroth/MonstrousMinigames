import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { GameNames } from '../../../config/games';
import { startedHandler, useStartedHandler } from '../../../domain/commonGameState/controller/startedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasStartedMessage } from '../../../domain/typeGuards/game1/started';
import { MessageTypes } from '../../../utils/constants';
import { controllerGame1Route, controllerGame2Route, controllerGame3Route } from '../../../utils/routes';

describe('startedHandler', () => {
    const setGameStarted = jest.fn();
    const roomId = '1234';
    const history = createMemoryHistory();

    const message: GameHasStartedMessage = {
        type: MessageTypes.gameHasStarted,
        game: GameNames.game1,
        countdownTime: 3000,
    };

    it('when GameHasStartedMessage is emmitted, handed setGameStarted should be called with true', async () => {
        const socket = new FakeInMemorySocket();
        const withDependencies = startedHandler({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies(socket, roomId);
        await socket.emit(message);

        expect(setGameStarted).toHaveBeenLastCalledWith(true);
    });

    it('when game is game1, history should redirect to game1', async () => {
        const socket = new FakeInMemorySocket();
        const history = createMemoryHistory();
        const game = GameNames.game1;

        const withDependencies = startedHandler({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies(socket, roomId);
        await socket.emit({ ...message, game });

        expect(history.location).toHaveProperty('pathname', controllerGame1Route(roomId));
    });

    it('when game is game2, history should redirect to game2', async () => {
        const socket = new FakeInMemorySocket();
        const history = createMemoryHistory();
        const game = GameNames.game2;

        const withDependencies = startedHandler({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies(socket, roomId);
        await socket.emit({ ...message, game });

        expect(history.location).toHaveProperty('pathname', controllerGame2Route(roomId));
    });

    it('when game is game3, history should redirect to game3', async () => {
        const socket = new FakeInMemorySocket();
        const history = createMemoryHistory();
        const game = GameNames.game3;

        const withDependencies = startedHandler({
            setGameStarted,
            history,
            setCountdownTime: jest.fn(),
        });

        withDependencies(socket, roomId);
        await socket.emit({ ...message, game });

        expect(history.location).toHaveProperty('pathname', controllerGame3Route(roomId));
    });
});

describe('useStartedHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const startedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useStartedHandler(socket, startedHandler));

        expect(startedHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const startedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useStartedHandler(socket, startedHandler));

        expect(startedHandler).toHaveBeenCalledTimes(0);
    });
});
