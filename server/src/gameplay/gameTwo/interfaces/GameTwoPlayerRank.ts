import { IPlayerRank } from '../../interfaces/IPlayerRank';

export interface GameTwoPlayerRank extends IPlayerRank {
    id: string;
    name: string;
    isActive: boolean;
    points: number;
    previousRank: number|null;
}
