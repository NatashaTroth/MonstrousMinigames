import { History } from 'history';

import { screenLobbyRoute } from '../../../../utils/routes';
import messageHandler from '../../../socket/messageHandler';
import { phaserLoadingTimedOutTypeGuard } from '../../../typeGuards/game1/phaserLoadingTimedOut';

interface Dependencies {
    history: History;
}
export const phaserLoadedTimedOutHandler = messageHandler(
    phaserLoadingTimedOutTypeGuard,
    (message, dependencies: Dependencies, roomId) => {
        dependencies.history.push(screenLobbyRoute(roomId));
    }
);
