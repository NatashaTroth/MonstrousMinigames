import { IPlayerRank } from '../../interfaces/IPlayerRank';

export interface GameTwoPlayerRank extends IPlayerRank {
    id: string;
    name: string;
    positionX: number;
    positionY: number;
    isActive: boolean;
    points: number;
    previousRank: number|null;
}
