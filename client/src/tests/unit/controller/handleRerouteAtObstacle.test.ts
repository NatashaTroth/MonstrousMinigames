import { createMemoryHistory } from 'history';

import { handleReroute } from '../../../domain/game1/controller/gameState/handleRerouteAtObstacle';
import { ObstacleTypes } from '../../../utils/constants';
import { controllerGame1Route, controllerObstacleRoute } from '../../../utils/routes';

describe('handleRerouteAtObstacle', () => {
    const obstacle = {
        type: ObstacleTypes.treeStump,
        id: 1,
    };
    const roomId = 'ACES';

    it('should reroute to obstacle route if obstacle is given', () => {
        const history = createMemoryHistory();

        handleReroute(false, obstacle, roomId, history);

        expect(history.location).toHaveProperty('pathname', controllerObstacleRoute(roomId, obstacle.type));
    });

    it('should reroute to game1 route if reroute is true', () => {
        const history = createMemoryHistory();

        handleReroute(true, undefined, roomId, history);

        expect(history.location).toHaveProperty('pathname', controllerGame1Route(roomId));
    });

    it('should not reroute if obstacle is undefined and reroute is false', () => {
        const history = createMemoryHistory();

        handleReroute(false, undefined, roomId, history);

        expect(history.location).toHaveProperty('pathname', '/');
    });
});
