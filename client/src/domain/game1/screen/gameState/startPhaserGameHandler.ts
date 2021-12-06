import { History } from 'history';

import { screenGame1Route } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { startPhaserGameTypeGuard } from '../../../typeGuards/startPhaserGame';

interface Dependencies {
    setGameStarted: (val: boolean) => void;
    history: History;
}

export const startPhaserGameHandler = messageHandler(
    startPhaserGameTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        const { setGameStarted, history } = dependencies;

        setGameStarted(true);
        history.push(screenGame1Route(roomId));
    }
);
