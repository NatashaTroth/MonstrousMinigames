import { History } from 'history';

import { controllerLobbyRoute } from '../../../utils/routes';

export function handleGameHasResetMessage(history: History, roomId: string) {
    history.push(controllerLobbyRoute(roomId));
}
