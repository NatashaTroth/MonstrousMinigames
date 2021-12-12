import { renderHook } from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import React from 'react';

import { newRoundHandler, useNewRoundHandler } from '../../../domain/game3/controller/gameState/newRoundHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
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
        const history = createMemoryHistory();
        const setRoundIdx = jest.fn();
        const setVotingResults = jest.fn();
        const setVoteForPhotoMessage = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = newRoundHandler({ setRoundIdx, setVoteForPhotoMessage, setVotingResults, history });
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
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useNewRoundHandler(socket, newRoundHandler));

        expect(newRoundHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const newRoundHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useNewRoundHandler(socket, newRoundHandler));

        expect(newRoundHandler).toHaveBeenCalledTimes(0);
    });
});
