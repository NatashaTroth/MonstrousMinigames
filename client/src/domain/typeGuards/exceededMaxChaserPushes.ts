import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ExceededMaxChaserPushesMessage {
    type: MessageTypes.exceededNumberOfChaserPushes;
}

export const exceededMaxChaserPushesTypeGuard = (data: MessageData): data is ExceededMaxChaserPushesMessage =>
    (data as ExceededMaxChaserPushesMessage).type === MessageTypes.exceededNumberOfChaserPushes;
