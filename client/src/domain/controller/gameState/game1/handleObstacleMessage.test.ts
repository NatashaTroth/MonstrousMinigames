import { MessageTypesGame1, ObstacleTypes } from '../../../../utils/constants';
import { ObstacleMessage } from '../../../typeGuards/game1/obstacle';
import { handleObstacleMessage } from './handleObstacleMessage';

describe('handleObstacleMessage', () => {
    const data: ObstacleMessage = {
        type: MessageTypesGame1.obstacle,
        obstacleType: ObstacleTypes.spider,
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
