import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface PlayerStunneddMessage {
    type: MessageTypes.playerStunned;
    rank: number;
}

export const playerStunnedTypeGuard = (data: MessageData): data is PlayerStunneddMessage =>
    (data as PlayerStunneddMessage).type === MessageTypes.playerStunned;
