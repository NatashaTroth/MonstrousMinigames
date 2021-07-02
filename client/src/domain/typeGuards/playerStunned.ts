import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface PlayerStunnedMessage {
    type: MessageTypes.playerStunned;
    rank: number;
}

export const playerStunnedTypeGuard = (data: MessageData): data is PlayerStunnedMessage =>
    (data as PlayerStunnedMessage).type === MessageTypes.playerStunned;
