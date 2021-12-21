import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { diedHandler, useDiedHandler } from '../../../domain/game1/controller/gameState/diedHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { PlayerDiedMessage } from '../../../domain/typeGuards/game1/playerDied';
import { MessageTypesGame1 } from '../../../utils/constants';

describe('diedHandler', () => {
    let setPlayerDead: jest.Mock<any, any>;
    let setPlayerRank: jest.Mock<any, any>;
    const roomId = 'ABCDE';

    const mockData: PlayerDiedMessage = {
        type: MessageTypesGame1.playerDied,
        rank: 1,
    };

    beforeEach(() => {
        setPlayerDead = jest.fn();
        setPlayerRank = jest.fn();
    });

    it('handed playerDied should be called with true', async () => {
        const socket = new FakeInMemorySocket();
        const withDependencies = diedHandler({
            setPlayerDead,
            setPlayerRank,
        });

        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(setPlayerDead).toHaveBeenLastCalledWith(true);
    });

    it('handed setPlayerRank should be called with passed rank', async () => {
        const socket = new FakeInMemorySocket();
        const withDependencies = diedHandler({
            setPlayerDead,
            setPlayerRank,
        });

        withDependencies(socket, roomId);

        await socket.emit(mockData);

        expect(setPlayerRank).toHaveBeenLastCalledWith(mockData.rank);
    });
});

describe('useDiedHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const diedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useDiedHandler(socket, diedHandler));

        expect(diedHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const diedHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useDiedHandler(socket, diedHandler));

        expect(diedHandler).toHaveBeenCalledTimes(0);
    });
});
