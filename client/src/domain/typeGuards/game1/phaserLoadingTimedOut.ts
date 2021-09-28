import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface PhaserLoadingTimedOutMessage {
    type: MessageTypesGame1.phaserLoadingTimedOut;
}

export const phaserLoadingTimedOutTypeGuard = (data: MessageData): data is PhaserLoadingTimedOutMessage =>
    (data as PhaserLoadingTimedOutMessage).type === MessageTypesGame1.phaserLoadingTimedOut;
