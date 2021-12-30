import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import {
    useVotingResultsHandler,
    votingResultsHandler,
} from '../../../domain/game3/controller/gameState/votingResultsHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { VotingResultsMessage } from '../../../domain/typeGuards/game3/votingResults';
import { MessageTypesGame3 } from '../../../utils/constants';

describe('votingResultsHandler', () => {
    const roomId = 'ANES';
    const message: VotingResultsMessage = {
        type: MessageTypesGame3.votingResults,
        roomId,
        countdownTime: 3000,
        results: [],
    };

    it('when VotingResultsMessage is written, setVotingResults should be called', async () => {
        const setVotingResults = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = votingResultsHandler({ setVotingResults });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setVotingResults).toHaveBeenCalledTimes(1);
    });
});

describe('useVotingResultsHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const votingResultsHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useVotingResultsHandler(socket, votingResultsHandler));

        expect(votingResultsHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const votingResultsHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useVotingResultsHandler(socket, votingResultsHandler));

        expect(votingResultsHandler).toHaveBeenCalledTimes(0);
    });
});
