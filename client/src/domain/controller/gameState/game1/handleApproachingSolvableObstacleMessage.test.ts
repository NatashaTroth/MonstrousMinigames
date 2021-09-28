import { MessageTypesGame1, ObstacleTypes } from '../../../../utils/constants';
import { ApproachingSolvableObstacleMessage } from '../../../typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { handleApproachingObstacleMessage } from './handleApproachingSolvableObstacleMessage';

describe('handleApproachingObstacleMessage', () => {
    const data: ApproachingSolvableObstacleMessage = {
        type: MessageTypesGame1.approachingSolvableObstacle,
        obstacleType: ObstacleTypes.spider,
        obstacleId: 1,
        distance: 200,
    };

    const setEarlySolvableObstacle = jest.fn();

    it('when message type is approachingSolvableObstacle, handed setEarlySolvableObstacle should be called', () => {
        handleApproachingObstacleMessage({
            data,
            setEarlySolvableObstacle,
        });

        expect(setEarlySolvableObstacle).toHaveBeenCalledTimes(1);
    });
});
