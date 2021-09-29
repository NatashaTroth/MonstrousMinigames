import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface Game2HasStartedMessage {
    type: MessageTypesGame2.started;
    countdownTime: number;
}

export const startedTypeGuard = (data: MessageDataGame2): data is Game2HasStartedMessage =>
    (data as Game2HasStartedMessage).type === MessageTypesGame2.started;
