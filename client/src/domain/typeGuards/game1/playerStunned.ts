import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface PlayerStunnedMessage {
    type: MessageTypesGame1.playerStunned;
    rank: number;
}

export const playerStunnedTypeGuard = (data: MessageData): data is PlayerStunnedMessage =>
    (data as PlayerStunnedMessage).type === MessageTypesGame1.playerStunned;
