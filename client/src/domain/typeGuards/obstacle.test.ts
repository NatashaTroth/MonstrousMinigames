import { MessageTypes, Obstacles } from '../../utils/constants';
import { ObstacleMessage, obstacleTypeGuard } from './obstacle';

describe('obstacle TypeGuard', () => {
    it('when type is obstacle, it should return true', () => {
        const data: ObstacleMessage = {
            type: MessageTypes.obstacle,
            obstacleId: 1,
            obstacleType: Obstacles.treeStump,
        };

        expect(obstacleTypeGuard(data)).toEqual(true);
    });
});
