import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface AllScreensSheepGameLoadedMessage {
    type: MessageTypesGame2.allScreensSheepGameLoaded;
}

export const allScreensSheepGameLoadedTypeGuard = (data: MessageDataGame2): data is AllScreensSheepGameLoadedMessage =>
    (data as AllScreensSheepGameLoadedMessage).type === MessageTypesGame2.allScreensSheepGameLoaded;
