import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ObstacleSkippedMessage {
    type: MessageTypes.obstacleSkipped;
    userId: string;
    obstacleId: number;
}

export const obstacleSkippedTypeGuard = (data: MessageData): data is ObstacleSkippedMessage =>
    (data as ObstacleSkippedMessage).type === MessageTypes.obstacleSkipped;
