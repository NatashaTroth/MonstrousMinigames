import { History } from 'history';

import { controllerLobbyRoute } from '../../../utils/routes';

interface Dependencies {
    history: History;
}

export function handleGameHasStoppedMessage(dependencies: Dependencies) {
    return (roomId: string) => {
        dependencies.history.push(controllerLobbyRoute(roomId));
    };
}
