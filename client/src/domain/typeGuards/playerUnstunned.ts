import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface PlayerUnstunnedMessage {
    type: MessageTypes.playerUnstunned;
}

export const playerUnstunnedTypeGuard = (data: MessageData): data is PlayerUnstunnedMessage =>
    (data as PlayerUnstunnedMessage).type === MessageTypes.playerUnstunned;
