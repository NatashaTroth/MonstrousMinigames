import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface PlayerDiedMessage {
    type: MessageTypesGame1.playerDied;
    rank: number;
}

export const playerDiedTypeGuard = (data: MessageData): data is PlayerDiedMessage =>
    (data as PlayerDiedMessage).type === MessageTypesGame1.playerDied;
