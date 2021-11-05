import { MessageTypesGame1, ObstacleTypes } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface ApproachingSolvableObstacleMessage {
    type: MessageTypesGame1.approachingSolvableObstacle;
    obstacleType: ObstacleTypes;
    obstacleId: number;
    distance: number;
}

export const approachingSolvableObstacleTypeGuard = (data: MessageData): data is ApproachingSolvableObstacleMessage =>
    (data as ApproachingSolvableObstacleMessage).type === MessageTypesGame1.approachingSolvableObstacle;
