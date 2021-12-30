import { History } from 'history';

import { Obstacle } from '../../../../contexts/game1/Game1ContextProvider';
import { controllerGame1Route, controllerObstacleRoute } from '../../../../utils/routes';

export function handleReroute(
    reroute: boolean,
    obstacle: Obstacle | undefined,
    roomId: string | undefined,
    history: History
) {
    if (obstacle) {
        history.push(controllerObstacleRoute(roomId, obstacle.type)!);
        return true;
    }

    if (reroute) {
        history.push(controllerGame1Route(roomId));
    }

    return false;
}
