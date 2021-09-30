import { IPlayerRank } from '../../interfaces/IPlayerRank';

export interface GameNumberPlayerRank extends IPlayerRank {
    id: string;
    name: string;
    rank: number;
    isActive: boolean;
}
