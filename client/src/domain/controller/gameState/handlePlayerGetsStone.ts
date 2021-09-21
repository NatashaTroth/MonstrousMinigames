import { History } from 'history';

import { ObstacleTypes } from '../../../utils/constants';
import { controllerObstacleRoute } from '../../../utils/routes';

export function handlePlayerGetsStone(history: History, roomId: string | undefined) {
    history.push(controllerObstacleRoute(roomId, ObstacleTypes.stone));
}
