import { ObstacleMessage, obstacleTypeGuard } from '../../../domain/typeGuards/game1/obstacle';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('obstacle TypeGuard', () => {
    it('when type is obstacle, it should return true', () => {
        const data: ObstacleMessage = {
            type: MessageTypesGame1.obstacle,
            obstacleId: 1,
            obstacleType: ObstacleTypes.treeStump,
        };

        expect(obstacleTypeGuard(data)).toEqual(true);
    });
});
