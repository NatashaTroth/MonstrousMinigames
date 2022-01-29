import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { finishedHandler, useFinishedHandler } from '../../../domain/commonGameState/screen/finishedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasFinishedMessage } from '../../../domain/typeGuards/finished';
import { GameState, MessageTypes } from '../../../utils/constants';
import { screenFinishedRoute } from '../../../utils/routes';

describe('finishedHandler', () => {
    const roomId = '1234';

    const data: GameHasFinishedMessage = {
        type: MessageTypes.gameHasFinished,
        data: {
            gameState: GameState.finished,
            numberOfObstacles: 4,
            roomId,
            trackLength: 400,
            playerRanks: [],
            playersState: [],
        },
    };

    it('when message type is gameHasFinished, history push should be called', async () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = finishedHandler({ history, setFinished, setPlayerRanks });
        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(history.location).toHaveProperty('pathname', screenFinishedRoute(roomId));
    });

    it('handed setPlayerRanks should be called with passed data', async () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = finishedHandler({ history, setFinished, setPlayerRanks });
        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(setPlayerRanks).toHaveBeenCalledWith(data.data.playerRanks);
    });

    it('handed setFinished should be called with true', async () => {
        const history = createMemoryHistory();
        const setFinished = jest.fn();
        const setPlayerRanks = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = finishedHandler({ history, setFinished, setPlayerRanks });
        withDependencies(socket, roomId);

        await socket.emit(data);

        expect(setFinished).toHaveBeenCalledWith(true);
    });
});

describe('useFinishedHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const finishedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useFinishedHandler(socket, finishedHandler));

        expect(finishedHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const finishedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useFinishedHandler(socket, finishedHandler));

        expect(finishedHandler).toHaveBeenCalledTimes(0);
    });
});
