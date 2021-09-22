import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface PhaserLoadingTimedOutMessage {
    type: MessageTypes.phaserLoadingTimedOut;
}

export const phaserLoadingTimedOutTypeGuard = (data: MessageData): data is PhaserLoadingTimedOutMessage =>
    (data as PhaserLoadingTimedOutMessage).type === MessageTypes.phaserLoadingTimedOut;
