import { ObstacleDetails } from './';

export interface PlayersState {
    atObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    id: string;
    isActive: boolean;
    name: string;
    obstacles: ObstacleDetails[];
    positionX: number;
    rank: number;
}
