import { MessageTypes, ObstacleTypes } from '../../utils/constants';
import { TrashType } from '../screen/phaser/enums';
import { MessageData } from './MessageData';

export interface ObstacleMessage {
    type: MessageTypes.obstacle;
    obstacleType: ObstacleTypes;
    obstacleId: number;
    skippable: boolean;
    numberTrashItems?: number;
    trashType?: TrashType;
}

export const obstacleTypeGuard = (data: MessageData): data is ObstacleMessage =>
    (data as ObstacleMessage).type === MessageTypes.obstacle;
