import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface AllScreensPhaserGameLoadedMessage {
    type: MessageTypesGame2.allScreensPhaserGameLoaded;
}

export const allScreensPhaserGameLoadedTypeGuard = (
    data: MessageDataGame2
): data is AllScreensPhaserGameLoadedMessage =>
    (data as AllScreensPhaserGameLoadedMessage).type === MessageTypesGame2.allScreensPhaserGameLoaded;
