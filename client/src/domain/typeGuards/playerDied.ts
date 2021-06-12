import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface PlayerDiedMessage {
    type: MessageTypes.playerDied;
    rank: number;
}

export const playerDiedTypeGuard = (data: MessageData): data is PlayerDiedMessage =>
    (data as PlayerDiedMessage).type === MessageTypes.playerDied;
