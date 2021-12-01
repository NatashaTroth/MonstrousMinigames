import { History } from 'history';

import { screenLobbyRoute } from '../../../utils/routes';

interface Dependencies {
    history: History;
}

export function handleGameHasStoppedMessage(dependencies: Dependencies) {
    return (roomId: string) => {
        dependencies.history.push(screenLobbyRoute(roomId));
    };
}
