import { Obstacle } from './';

export interface PlayerState {
    id: string;
    name: string;
    positionX: number;
    obstacles: Array<Obstacle>;
    atObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    rank: number;
    isActive: boolean;
}
