import { ObstacleType } from '../enums';

export interface Obstacle {
    id: number;
    type: ObstacleType;
    positionX: number;
}
