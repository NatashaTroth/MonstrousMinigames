import { IPlayerState } from '../../interfaces';

export interface PlayerState extends IPlayerState {
    id: string;
    name: string;
    rank: number;
    isActive: boolean;
}
