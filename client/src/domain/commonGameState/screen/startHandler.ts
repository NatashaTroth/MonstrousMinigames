import { History } from 'history';
import React from 'react';

import { GameNames } from '../../../config/games';
import { GameContext } from '../../../contexts/GameContextProvider';
import { screenGame3Route } from '../../../utils/routes';
import history from '../../history/history';
import messageHandler from '../../socket/messageHandler';
import { Socket } from '../../socket/Socket';
import { startedTypeGuard } from '../../typeGuards/game1/started';

export interface HandleGameStartedProps {
    roomId: string;
    game: GameNames;
    countdownTime: number;
}

interface Dependencies {
    setGameStarted: (val: boolean) => void;
    history: History;
    setCountdownTime: (val: number) => void;
}

export const startHandler = messageHandler(startedTypeGuard, (message, dependencies: Dependencies, roomId) => {
    const { setGameStarted, history, setCountdownTime } = dependencies;

    switch (message.game) {
        case GameNames.game3:
            setGameStarted(true);
            setCountdownTime(message.countdownTime);
            history.push(screenGame3Route(roomId));
            return;
    }
});

export const useStartHandler = (socket: Socket, handler = startHandler) => {
    const { setGameStarted, setCountdownTime, roomId } = React.useContext(GameContext);

    React.useEffect(() => {
        if (!roomId) return;
        const startHandlerWithDependencies = handler({ history, setCountdownTime, setGameStarted });
        startHandlerWithDependencies(socket, roomId);
    }, [handler, roomId, setCountdownTime, setGameStarted, socket]);
};
