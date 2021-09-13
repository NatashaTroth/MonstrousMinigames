import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface AllScreensPhaserGameLoadedMessage {
    type: MessageTypes.allScreensPhaserGameLoaded;
}

export const allScreensPhaserGameLoadedTypeGuard = (data: MessageData): data is AllScreensPhaserGameLoadedMessage =>
    (data as AllScreensPhaserGameLoadedMessage).type === MessageTypes.allScreensPhaserGameLoaded;
