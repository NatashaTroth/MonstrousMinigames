import { ObstacleType, TrashType } from '../enums';

export interface ObstacleTypeObject {
    type: ObstacleType;
    numberTrashItems?: number;
    trashType?: TrashType;
}
