import { MessageTypes } from '../../utils/constants';
import { ObstacleSkippedMessage, obstacleSkippedTypeGuard } from './obstacleSkipped';

describe('obstacle TypeGuard', () => {
    it('when type is obstacle, it should return true', () => {
        const data: ObstacleSkippedMessage = {
            type: MessageTypes.obstacleSkipped,
            obstacleId: 1,
            userId: 'xxx',
        };

        expect(obstacleSkippedTypeGuard(data)).toEqual(true);
    });
});
