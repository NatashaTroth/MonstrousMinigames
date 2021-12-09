import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    playerFinishedHandler,
    usePlayerFinishedHandler,
} from '../../../domain/commonGameState/controller/handlePlayerFinishedMessage';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { PlayerFinishedMessage } from '../../../domain/typeGuards/game1/playerFinished';
import { MessageTypesGame1 } from '../../../utils/constants';

beforeEach(() => {
    global.sessionStorage.clear();
});

describe('playerFinishedHandler', () => {
    let setPlayerFinished: jest.Mock<any, any>;
    let setPlayerRank: jest.Mock<any, any>;
    const roomId = 'ABCDE';

    const mockData: PlayerFinishedMessage = {
        type: MessageTypesGame1.playerFinished,
        rank: 1,
        userId: '1',
    };

    beforeEach(() => {
        setPlayerFinished = jest.fn();
        setPlayerRank = jest.fn();
    });

    it('handed setPlayerFinished should be called with true', async () => {
        const playerFinished = false;
        const socket = new InMemorySocketFake();

        const withDependencies = playerFinishedHandler({
            setPlayerFinished,
            setPlayerRank,
            playerFinished,
        });

        withDependencies(socket, roomId);
        await socket.emit(mockData);

        expect(setPlayerFinished).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', async () => {
        const playerFinished = false;
        const socket = new InMemorySocketFake();

        const withDependencies = playerFinishedHandler({
            setPlayerFinished,
            setPlayerRank,
            playerFinished,
        });

        withDependencies(socket, roomId);
        await socket.emit(mockData);

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });

    it('if player has already finished, setPlayerFinished should not be called', async () => {
        const playerFinished = true;
        const socket = new InMemorySocketFake();

        const withDependencies = playerFinishedHandler({
            setPlayerFinished,
            setPlayerRank,
            playerFinished,
        });

        withDependencies(socket, roomId);
        await socket.emit(mockData);

        expect(setPlayerFinished).toHaveBeenCalledTimes(0);
    });

    it('if player has already finished, setPlayerRank should not be called', async () => {
        const playerFinished = true;
        const socket = new InMemorySocketFake();

        const withDependencies = playerFinishedHandler({
            setPlayerFinished,
            setPlayerRank,
            playerFinished,
        });

        withDependencies(socket, roomId);
        await socket.emit(mockData);

        expect(setPlayerRank).toHaveBeenCalledTimes(0);
    });

    it('stomeTimeoutId should be remove from sessionStorage', async () => {
        const setPlayerRank = jest.fn();
        const setPlayerFinished = jest.fn();
        const socket = new InMemorySocketFake();

        const playerFinished = false;
        global.sessionStorage.setItem('windmillTimeoutId', '1');

        const withDependencies = playerFinishedHandler({
            setPlayerFinished,
            setPlayerRank,
            playerFinished,
        });

        withDependencies(socket, roomId);
        await socket.emit(mockData);

        expect(global.sessionStorage.getItem('windmillTimeoutId')).toBe(null);
    });
});

describe('usePlayerFinishedHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const playerFinishedHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => usePlayerFinishedHandler(socket, playerFinishedHandler));

        expect(playerFinishedHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const playerFinishedHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => usePlayerFinishedHandler(socket, playerFinishedHandler));

        expect(playerFinishedHandler).toHaveBeenCalledTimes(0);
    });
});
