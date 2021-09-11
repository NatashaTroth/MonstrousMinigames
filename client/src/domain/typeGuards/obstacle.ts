import { MessageTypes, ObstacleTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ObstacleMessage {
    type: MessageTypes.obstacle;
    obstacleType: ObstacleTypes;
    obstacleId: number;
}

export const obstacleTypeGuard = (data: MessageData): data is ObstacleMessage =>
    (data as ObstacleMessage).type === MessageTypes.obstacle;
