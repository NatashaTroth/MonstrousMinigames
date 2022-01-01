import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { resumeHandler, useResumeHandler } from '../../../domain/commonGameState/resumeHandler';
import { FakeInMemorySocket } from '../../../domain/socket/InMemorySocketFake';
import { GameHasResumedMessage } from '../../../domain/typeGuards/resumed';
import { MessageTypes } from '../../../utils/constants';

describe('resumeHandler', () => {
    const mockData: GameHasResumedMessage = {
        type: MessageTypes.gameHasResumed,
    };

    it('when GameHasResumedMessage is emitted, handed setHasPause should be called with false', async () => {
        const setHasPaused = jest.fn();
        const socket = new FakeInMemorySocket();

        const withDependencies = resumeHandler({ setHasPaused });
        withDependencies(socket, 'SDFO');

        await socket.emit(mockData);

        expect(setHasPaused).toHaveBeenCalledWith(false);
    });
});

describe('useResumeHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const resumeHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useResumeHandler(socket, resumeHandler));

        expect(resumeHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const resumeHandler = jest.fn();
        const socket = new FakeInMemorySocket();

        renderHook(() => useResumeHandler(socket, resumeHandler));

        expect(resumeHandler).toHaveBeenCalledTimes(0);
    });
});
