import { History } from 'history';

import { controllerWindmillRoute } from '../../../utils/routes';

export function handlePlayerGetsWindmill(history: History, roomId: string | undefined) {
    history.push(controllerWindmillRoute(roomId));
}
