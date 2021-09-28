import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface PlayerUnstunnedMessage {
    type: MessageTypesGame1.playerUnstunned;
}

export const playerUnstunnedTypeGuard = (data: MessageData): data is PlayerUnstunnedMessage =>
    (data as PlayerUnstunnedMessage).type === MessageTypesGame1.playerUnstunned;
