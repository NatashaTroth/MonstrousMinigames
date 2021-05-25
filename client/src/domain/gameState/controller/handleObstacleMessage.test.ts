import { MessageTypes, Obstacles } from '../../../utils/constants';
import { ObstacleMessage } from '../../typeGuards/obstacle';
import { handleObstacleMessage } from './handleObstacleMessage';

describe('handleObstacleMessage', () => {
    const data: ObstacleMessage = {
        type: MessageTypes.obstacle,
        obstacleType: Obstacles.spider,
        obstacleId: 1,
    };

    const roomId = '1234';
    const setObstacle = jest.fn();

    it('when message type is obstacle, handed setObstacle should be called', () => {
        handleObstacleMessage({
            data,
            roomId,
            setObstacle,
        });

        expect(setObstacle).toHaveBeenCalledTimes(1);
    });
});
