import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface ObstacleWillBeSolvedMessage {
    type: MessageTypesGame1.obstacleWillBeSolved;
    userId: string;
    obstacleId: number;
}

export const obstacleWillBeSolvedTypeGuard = (data: MessageData): data is ObstacleWillBeSolvedMessage =>
    (data as ObstacleWillBeSolvedMessage).type === MessageTypesGame1.obstacleWillBeSolved;
