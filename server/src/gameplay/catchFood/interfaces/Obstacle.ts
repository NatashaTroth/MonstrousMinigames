import { ObstacleType, TrashType } from '../enums';

export interface Obstacle {
    id: number;
    type: ObstacleType;
    positionX: number;
    skippable: boolean;
    numberTrashItems?: number;
    trashType?: TrashType;
}
