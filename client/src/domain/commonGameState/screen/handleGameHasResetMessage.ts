import { History } from 'history';

import { screenLobbyRoute } from '../../../utils/routes';

interface Dependencies {
    history: History;
}

export function handleGameHasResetMessage(dependencies: Dependencies) {
    return (roomId: string) => {
        const { history } = dependencies;
        history.push(screenLobbyRoute(roomId));
    };
}
