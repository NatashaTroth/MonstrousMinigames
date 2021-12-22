import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface RemainingKillsMessage {
    type: MessageTypesGame2.remainingKills;
    roomId: string;
    userId: string;
    remainingKills: number;
}

export const remainingKillsTypeGuard = (data: MessageDataGame2): data is RemainingKillsMessage =>
    (data as RemainingKillsMessage).type === MessageTypesGame2.remainingKills;
