import { IPlayerState } from '../../interfaces';
import { Obstacle } from './';

export interface PlayerState extends IPlayerState {
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
