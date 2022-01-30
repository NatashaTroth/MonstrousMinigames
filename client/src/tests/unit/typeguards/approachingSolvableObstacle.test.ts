import {
    ApproachingSolvableObstacleMessage,
    approachingSolvableObstacleTypeGuard,
} from '../../../domain/typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('approachingSolvableObstacle TypeGuard', () => {
    it('when type is approachingSolvableObstacle, it should return true', () => {
        const data: ApproachingSolvableObstacleMessage = {
            type: MessageTypesGame1.approachingSolvableObstacle,
            obstacleId: 1,
            obstacleType: ObstacleTypes.stone,
            distance: 1,
        };

        expect(approachingSolvableObstacleTypeGuard(data)).toEqual(true);
    });
});
