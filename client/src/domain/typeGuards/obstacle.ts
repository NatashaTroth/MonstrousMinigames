import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes, Obstacles } from '../../utils/constants';

export interface ObstacleMessage {
    type: MessageTypes.obstacle;
    obstacleType: Obstacles;
    obstacleId: number;
}

export const obstacleTypeGuard = (data: MessageData): data is ObstacleMessage =>
    (data as ObstacleMessage).type === MessageTypes.obstacle;
