import { ObstacleDetails } from './';

export interface PlayersState {
    dead: boolean;
    atObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    id: string;
    isActive: boolean;
    name: string;
    obstacles: ObstacleDetails[];
    positionX: number;
    positionY?: number;
    rank: number;
    characterNumber: number;
    stunned: boolean;
}
