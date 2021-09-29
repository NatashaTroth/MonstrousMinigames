import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface PhaserLoadingTimedOutMessage {
    type: MessageTypesGame2.phaserLoadingTimedOut;
}

export const phaserLoadingTimedOutTypeGuard = (data: MessageDataGame2): data is PhaserLoadingTimedOutMessage =>
    (data as PhaserLoadingTimedOutMessage).type === MessageTypesGame2.phaserLoadingTimedOut;
