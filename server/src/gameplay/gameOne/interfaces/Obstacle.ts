import { ObstacleType, TrashType } from '../enums';

export interface Obstacle {
    id: number;
    type: ObstacleType;
    positionX: number;
    solvable: boolean;
    numberTrashItems?: number;
    trashType?: TrashType;
    sentApproachingMessage?: boolean;
}
