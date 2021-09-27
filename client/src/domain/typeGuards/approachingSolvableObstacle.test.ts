import { MessageTypes, ObstacleTypes } from '../../utils/constants';
import {
    ApproachingSolvableObstacleMessage,
    approachingSolvableObstacleTypeGuard,
} from './approachingSolvableObstacleTypeGuard';

describe('approachingSolvableObstacle TypeGuard', () => {
    it('when type is approachingSolvableObstacle, it should return true', () => {
        const data: ApproachingSolvableObstacleMessage = {
            type: MessageTypes.approachingSolvableObstacle,
            obstacleId: 1,
            obstacleType: ObstacleTypes.stone,
            distance: 1,
        };

        expect(approachingSolvableObstacleTypeGuard(data)).toEqual(true);
    });
});
