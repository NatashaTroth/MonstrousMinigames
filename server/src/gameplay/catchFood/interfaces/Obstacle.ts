import { ObstacleType } from './';

export interface Obstacle {
    id: number;
    type: ObstacleType;
    positionX: number;
}
