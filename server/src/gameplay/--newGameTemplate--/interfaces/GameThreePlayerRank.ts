import { IPlayerRank } from '../../interfaces/IPlayerRank';

export interface GameThreePlayerRank extends IPlayerRank {
    id: string;
    name: string;
    rank: number;
    isActive: boolean;
}
