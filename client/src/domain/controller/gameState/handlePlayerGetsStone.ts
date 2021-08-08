import { History } from 'history';

import { controllerStoneRoute } from '../../../utils/routes';

export function handlePlayerGetsStone(history: History, roomId: string | undefined) {
    history.push(controllerStoneRoute(roomId));
}
