import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { GameNames } from '../../../config/games';
import { gameSetHandler, useGameSetHandler } from '../../../domain/commonGameState/gameSetHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameSetMessage } from '../../../domain/typeGuards/gameSet';
import { MessageTypes } from '../../../utils/constants';

describe('gameSetHandler', () => {
    const game = GameNames.game1;
    const mockData: GameSetMessage = {
        type: MessageTypes.gameSet,
        game,
    };

    it('when GameSetMessage is emitted, handed setChosenGame should be called with emitted game', async () => {
        const setChosenGame = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = gameSetHandler({ setChosenGame });
        withDependencies(socket, 'ASWR');

        await socket.emit(mockData);

        expect(setChosenGame).toHaveBeenCalledWith(game);
    });
});

describe('useGameSetHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const gameSetHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useGameSetHandler(socket, gameSetHandler));

        expect(gameSetHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const gameSetHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useGameSetHandler(socket, gameSetHandler));

        expect(gameSetHandler).toHaveBeenCalledTimes(0);
    });
});
