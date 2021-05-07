import { IPlayerRank } from '../../interfaces/IPlayerRank';

export interface CatchFoodGamePlayerRank extends IPlayerRank {
    id: string;
    name: string;
    rank: number;
    finished: boolean;
    totalTimeInMs: number;
    positionX: number;
    isActive: boolean;
}
