import { MessageTypes, ObstacleTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ApproachingSolvableObstacleOnceMessage {
    type: MessageTypes.approachingSolvableObstacleOnce;
    userId: string;
    obstacleType: ObstacleTypes;
    obstacleId: number;
    distance: number;
}

export const approachingSolvableObstacleOnceTypeGuard = (
    data: MessageData
): data is ApproachingSolvableObstacleOnceMessage =>
    (data as ApproachingSolvableObstacleOnceMessage).type === MessageTypes.approachingSolvableObstacleOnce;
