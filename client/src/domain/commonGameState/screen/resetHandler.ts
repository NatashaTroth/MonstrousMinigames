import { History } from 'history';

import { screenLobbyRoute } from '../../../utils/routes';
import messageHandler from '../../socket/messageHandler';
import { resetTypeGuard } from '../../typeGuards/reset';

interface Dependencies {
    history: History;
}

export const resetHandler = messageHandler(resetTypeGuard, (message, dependencies: Dependencies, roomId) => {
    dependencies.history.push(screenLobbyRoute(roomId));
});
