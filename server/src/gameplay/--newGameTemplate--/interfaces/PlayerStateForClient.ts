import { IPlayerState } from '../../interfaces';

export interface PlayerStateForClient extends IPlayerState {
    id: string;
    name: string;
    rank: number;
    isActive: boolean;
}
