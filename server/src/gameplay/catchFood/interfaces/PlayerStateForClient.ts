import { IPlayerState } from '../../interfaces';
import { Obstacle } from './';

export interface PlayerStateForClient extends IPlayerState {
    id: string;
    name: string;
    positionX: number;
    obstacles: Array<Obstacle>;
    atObstacle: boolean;
    canSkipObstacle: boolean;
    finished: boolean;
    finishedTimeMs: number;
    dead: boolean; //TODO test
    rank: number;
    isActive: boolean;
    stunned: boolean;
    characterNumber: number;
    numberStonesThrown: number;
}
