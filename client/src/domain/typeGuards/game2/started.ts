import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface Game2HasStartedMessage {
    type: MessageTypesGame2.started;
    countdownTime: number;
}

export const startedTypeGuard = (data: MessageData): data is Game2HasStartedMessage =>
    (data as Game2HasStartedMessage).type === MessageTypesGame2.started;
