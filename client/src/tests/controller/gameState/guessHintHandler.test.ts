import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { guessHintHandler, useGuessHintHandler } from '../../../domain/game2/controller/gameState/guessHintHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GuessHintMessage } from '../../../domain/typeGuards/game2/guessHint';
import { MessageTypesGame2 } from '../../../utils/constants';

describe('guessHintHandler', () => {
    const roomId = 'ANES';
    const message: GuessHintMessage = {
        type: MessageTypesGame2.guessHint,
        roomId,
        userId: '1',
        hint: 'Hint',
    };

    it('when GuessHintMessage is written, setGuessHint should be called', async () => {
        const setGuessHint = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = guessHintHandler({ setGuessHint });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setGuessHint).toHaveBeenCalledTimes(1);
    });
});

describe('useGuessHintHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const guessHintHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useGuessHintHandler(socket, guessHintHandler));

        expect(guessHintHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const guessHintHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useGuessHintHandler(socket, guessHintHandler));

        expect(guessHintHandler).toHaveBeenCalledTimes(0);
    });
});
