import { MessageTypesGame1, ObstacleTypes, TrashType } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface ObstacleMessage {
    type: MessageTypesGame1.obstacle;
    obstacleType: ObstacleTypes;
    obstacleId: number;
    numberTrashItems?: number;
    trashType?: TrashType;
}

export const obstacleTypeGuard = (data: MessageData): data is ObstacleMessage =>
    (data as ObstacleMessage).type === MessageTypesGame1.obstacle;
