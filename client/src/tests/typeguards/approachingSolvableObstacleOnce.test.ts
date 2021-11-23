import {
    ApproachingSolvableObstacleOnceMessage,
    approachingSolvableObstacleOnceTypeGuard,
} from '../../domain/typeGuards/game1/approachingSolvableObstacleOnceTypeGuard';
import { MessageTypesGame1, ObstacleTypes } from '../../utils/constants';

describe('approachingSolvableObstacleOnce TypeGuard', () => {
    it('when type is approachingSolvableObstacleOnce, it should return true', () => {
        const data: ApproachingSolvableObstacleOnceMessage = {
            type: MessageTypesGame1.approachingSolvableObstacleOnce,
            userId: 'xxx',
            obstacleId: 1,
            obstacleType: ObstacleTypes.stone,
            distance: 1,
        };

        expect(approachingSolvableObstacleOnceTypeGuard(data)).toEqual(true);
    });
});
