import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface ExceededMaxChaserPushesMessage {
    type: MessageTypesGame1.exceededNumberOfChaserPushes;
}

export const exceededMaxChaserPushesTypeGuard = (data: MessageData): data is ExceededMaxChaserPushesMessage =>
    (data as ExceededMaxChaserPushesMessage).type === MessageTypesGame1.exceededNumberOfChaserPushes;
