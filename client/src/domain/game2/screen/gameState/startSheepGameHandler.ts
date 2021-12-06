import { History } from 'history';

import { screenGame2Route } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { startSheepGameTypeGuard } from '../../../typeGuards/startSheepGame';

interface Dependencies {
    setSheepGameStarted: (val: boolean) => void;
    history: History;
}

export const startSheepGameHandler = messageHandler(
    startSheepGameTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        const { setSheepGameStarted, history } = dependencies;

        setSheepGameStarted(true);
        history.push(screenGame2Route(roomId));
    }
);
