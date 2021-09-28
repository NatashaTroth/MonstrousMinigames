import { MessageTypesGame1 } from '../../../utils/constants';
import { ObstacleSkippedMessage, obstacleSkippedTypeGuard } from './obstacleSkipped';

describe('obstacle TypeGuard', () => {
    it('when type is obstacle, it should return true', () => {
        const data: ObstacleSkippedMessage = {
            type: MessageTypesGame1.obstacleSkipped,
            obstacleId: 1,
            userId: 'xxx',
        };

        expect(obstacleSkippedTypeGuard(data)).toEqual(true);
    });
});
