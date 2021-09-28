import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface AllScreensPhaserGameLoadedMessage {
    type: MessageTypesGame1.allScreensPhaserGameLoaded;
}

export const allScreensPhaserGameLoadedTypeGuard = (data: MessageData): data is AllScreensPhaserGameLoadedMessage =>
    (data as AllScreensPhaserGameLoadedMessage).type === MessageTypesGame1.allScreensPhaserGameLoaded;
