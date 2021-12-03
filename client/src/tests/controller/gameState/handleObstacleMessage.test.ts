import { handleObstacleMessage } from '../../../domain/game1/controller/gameState/handleObstacleMessage';
import { ObstacleMessage } from '../../../domain/typeGuards/game1/obstacle';
import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';

describe('handleObstacleMessage', () => {
    const data: ObstacleMessage = {
        type: MessageTypesGame1.obstacle,
        obstacleType: ObstacleTypes.spider,
        obstacleId: 1,
    };

    const roomId = '1234';
    const setObstacle = jest.fn();

    it('when message type is obstacle, handed setObstacle should be called', () => {
        const withDependencies = handleObstacleMessage({
            setObstacle,
        });

        withDependencies({ data, roomId });

        expect(setObstacle).toHaveBeenCalledTimes(1);
    });
});
