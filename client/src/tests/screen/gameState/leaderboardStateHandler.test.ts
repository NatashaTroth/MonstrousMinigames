import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { GameType } from '../../../contexts/screen/ScreenSocketContextProvider';
import {
    leaderboardStateHandler,
    useLeaderboardStateHandler,
} from '../../../domain/commonGameState/screen/leaderboardStateHandler';
import { InMemorySocketFake } from '../../../domain/socket/InMemorySocketFake';
import { LeaderboardStateMessage } from '../../../domain/typeGuards/leaderboardState';
import { MessageTypes } from '../../../utils/constants';

describe('leaderboardStateHandler', () => {
    const roomId = 'ANES';
    const message: LeaderboardStateMessage = {
        type: MessageTypes.leaderboardState,
        leaderboardState: {
            gameHistory: [
                {
                    game: GameType.GameOne,
                    playerRanks: [
                        { id: '1', name: 'Harry', rank: 1, finished: true, isActive: true, points: 5 },
                        { id: '2', name: 'Ron', rank: 2, finished: true, isActive: true, points: 4 },
                        { id: '3', name: 'James', rank: 3, finished: true, isActive: true, points: 3 },
                        { id: '4', name: 'Luna', rank: 4, finished: true, isActive: true, points: 2 },
                    ],
                },
                {
                    game: GameType.GameTwo,
                    playerRanks: [
                        { id: '1', name: 'Harry', rank: 1, finished: true, isActive: true, points: 5 },
                        { id: '2', name: 'Ron', rank: 2, finished: true, isActive: true, points: 4 },
                        { id: '3', name: 'James', rank: 3, finished: true, isActive: true, points: 3 },
                        { id: '4', name: 'Luna', rank: 4, finished: true, isActive: true, points: 2 },
                    ],
                },
            ],
            userPoints: [
                { userId: '1', name: 'Harry', points: 5, rank: 1 },
                { userId: '2', name: 'Ron', points: 3, rank: 2 },
                { userId: '3', name: 'James', points: 2, rank: 3 },
                { userId: '4', name: 'Luna', points: 1, rank: 4 },
            ],
        },
    };

    it('when LeaderboardStateMessage is written, setLeaderboardState should be called', async () => {
        const setLeaderboardState = jest.fn();
        const socket = new InMemorySocketFake();

        const withDependencies = leaderboardStateHandler({ setLeaderboardState });
        withDependencies(socket, roomId);

        await socket.emit(message);

        expect(setLeaderboardState).toHaveBeenCalledTimes(1);
    });
});

describe('useLeaderboardStateHandler', () => {
    const context = React.useContext;

    afterEach(() => {
        React.useContext = context;
    });

    it('handed handler should be called', () => {
        const leaderboardStateHandler = jest.fn();
        const socket = new InMemorySocketFake();

        const mockUseContext = jest.fn().mockImplementation(() => ({
            roomId: 'ALEK',
        }));

        React.useContext = mockUseContext;

        renderHook(() => useLeaderboardStateHandler(socket, leaderboardStateHandler));

        expect(leaderboardStateHandler).toHaveBeenCalledTimes(1);
    });

    it('handed handler should not be called if there is no roomId', () => {
        const leaderboardStateHandler = jest.fn();
        const socket = new InMemorySocketFake();

        renderHook(() => useLeaderboardStateHandler(socket, leaderboardStateHandler));

        expect(leaderboardStateHandler).toHaveBeenCalledTimes(0);
    });
});
