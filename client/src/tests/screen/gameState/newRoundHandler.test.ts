import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { newRoundHandler, useNewRoundHandler } from '../../../domain/game3/screen/gameState/newRoundHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { NewRoundMessage } from '../../../domain/typeGuards/game3/newRound';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('newRoundHandler', () => {
    const roomId = 'ANES';
    const message: NewRoundMessage = {
        type: MessageTypesGame3.newRound,
        roomId,
        roundIdx: 1,
    };

    it('when NewRoundMessage is written, setRoundIdx should be called', async () => {
        const setRoundIdx = jest.fn();
        const setVotingResults = jest.fn();
        const setVoteForPhotoMessage = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = newRoundHandler({ setRoundIdx, setVoteForPhotoMessage, setVotingResults });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setRoundIdx).toHaveBeenCalledTimes(1);
    });
});

describe('useNewRoundHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const newRoundHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useNewRoundHandler(socket, newRoundHandler));

        expect(newRoundHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const newRoundHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useNewRoundHandler(socket, newRoundHandler));

        expect(newRoundHandler).toHaveBeenCalledTimes(0);
    });
});
