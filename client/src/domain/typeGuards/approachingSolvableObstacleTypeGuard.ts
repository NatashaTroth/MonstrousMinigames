import { MessageTypes, ObstacleTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ApproachingSolvableObstacleMessage {
    type: MessageTypes.approachingSolvableObstacle;
    obstacleType: ObstacleTypes;
    obstacleId: number;
    distance: number;
}

export const approachingSolvableObstacleTypeGuard = (data: MessageData): data is ApproachingSolvableObstacleMessage =>
    (data as ApproachingSolvableObstacleMessage).type === MessageTypes.approachingSolvableObstacle;
