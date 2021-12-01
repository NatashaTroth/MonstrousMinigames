import { handleApproachingObstacleMessage } from '../../../domain/game1/controller/gameState/handleApproachingSolvableObstacleMessage';
import { ApproachingSolvableObstacleMessage } from '../../../domain/typeGuards/game1/approachingSolvableObstacleTypeGuard';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('handleApproachingObstacleMessage', () => {
    const data: ApproachingSolvableObstacleMessage = {
        type: MessageTypesGame1.approachingSolvableObstacle,
        obstacleType: ObstacleTypes.spider,
        obstacleId: 1,
        distance: 200,
    };

    const setEarlySolvableObstacle = jest.fn();

    it('when message type is approachingSolvableObstacle, handed setEarlySolvableObstacle should be called', () => {
        const withDependencies = handleApproachingObstacleMessage({
            setEarlySolvableObstacle,
        });

        withDependencies(data);

        expect(setEarlySolvableObstacle).toHaveBeenCalledTimes(1);
    });

    it('when data distance is less than 10, handed setEarlySolvableObstacle should be called with undefined', () => {
        const setEarlySolvableObstacle = jest.fn();
        const withDependencies = handleApproachingObstacleMessage({
            setEarlySolvableObstacle,
        });

        withDependencies({
            ...data,
            distance: 5,
        });

        expect(setEarlySolvableObstacle).toHaveBeenCalledWith(undefined);
    });
});
