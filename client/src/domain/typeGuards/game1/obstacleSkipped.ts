import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface ObstacleSkippedMessage {
    type: MessageTypesGame1.obstacleSkipped;
    userId: string;
    obstacleId: number;
}

export const obstacleSkippedTypeGuard = (data: MessageData): data is ObstacleSkippedMessage =>
    (data as ObstacleSkippedMessage).type === MessageTypesGame1.obstacleSkipped;
