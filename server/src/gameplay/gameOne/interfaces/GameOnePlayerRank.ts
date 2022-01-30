import { IPlayerRank } from '../../interfaces/IPlayerRank';

export interface GameOnePlayerRank extends IPlayerRank {
    id: string;
    name: string;
    rank: number;
    finished: boolean;
    dead: boolean;
    totalTimeInMs: number;
    positionX: number;
    isActive: boolean;
    points?: number;
}
