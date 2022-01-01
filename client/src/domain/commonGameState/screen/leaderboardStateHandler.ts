import React from 'react';

import { GameContext, LeaderboardState } from '../../../contexts/GameContextProvider';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { leaderboardStateTypeGuard } from '../../typeGuards/leaderboardState';

interface Dependencies {
    setLeaderboardState: (state: LeaderboardState) => void;
}

export const leaderboardStateHandler = messageHandler(
    leaderboardStateTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        dependencies.setLeaderboardState(message.leaderboardState);
    }
);

export const useLeaderboardStateHandler = (socket: Socket, handler = leaderboardStateHandler) => {
    const { roomId, setLeaderboardState } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;

        const leaderboardStateHandlerWithDependencies = handler({ setLeaderboardState });
        leaderboardStateHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setLeaderboardState, socket]);
};
