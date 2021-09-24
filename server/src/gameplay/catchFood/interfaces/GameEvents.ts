import { ObstacleType, TrashType } from '../enums';

interface GameEventInterface {
    roomId: string;
}

export interface ObstacleReachedInfo extends GameEventInterface {
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    numberTrashItems?: number;
    trashType?: TrashType;
}
export interface ObstacleReachedInfoController {
    obstacleId: number;
    obstacleType: ObstacleType;
    numberTrashItems?: number;
    trashType?: TrashType;
}

export interface ApproachingSkippableObstacle extends GameEventInterface {
    userId: string;
    obstacleId: number;
    obstacleType: ObstacleType;
    distance: number;
}
