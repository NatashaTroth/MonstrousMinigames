import { IPlayerState } from '../../interfaces';

export interface PlayerStateForClient extends IPlayerState {
    id: string;
    name: string;
    positionX: number;
    positionY: number;
    isActive: boolean;
    characterNumber: number;
}
