import { History } from 'history';

import { controllerGame1Route } from '../../../../utils/routes';

export function handlePlayerUnstunned(history: History, roomId: string) {
    history.push(controllerGame1Route(roomId));
}
