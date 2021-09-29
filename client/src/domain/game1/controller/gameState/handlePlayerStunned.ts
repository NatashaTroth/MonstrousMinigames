import { History } from 'history';

import { controllerPlayerStunnedRoute } from '../../../../utils/routes';

export function handlePlayerStunned(history: History, roomId: string) {
    history.push(controllerPlayerStunnedRoute(roomId));
}
