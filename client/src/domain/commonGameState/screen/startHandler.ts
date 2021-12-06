import { History } from 'history';

import { GameNames } from '../../../config/games';
import { screenGame3Route } from '../../../utils/routes';
import messageHandler from '../../socket/messageHandler';
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
