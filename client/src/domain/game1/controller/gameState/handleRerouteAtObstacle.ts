import { Obstacle } from '../../../../contexts/game1/Game1ContextProvider';
import { controllerGame1Route, controllerObstacleRoute } from '../../../../utils/routes';
import history from '../../../history/history';

export function handleReroute(reroute: boolean, obstacle: Obstacle | undefined, roomId: string | undefined) {
    if (obstacle) {
        history.push(controllerObstacleRoute(roomId, obstacle.type)!);
        return true;
    } else if (reroute) {
        history.push(controllerGame1Route(roomId));
        return false;
    }

    return reroute;
}
