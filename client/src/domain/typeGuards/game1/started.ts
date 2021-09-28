import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface GameHasStartedMessage {
    type: MessageTypesGame1.started;
    countdownTime: number;
}

export const startedTypeGuard = (data: MessageData): data is GameHasStartedMessage =>
    (data as GameHasStartedMessage).type === MessageTypesGame1.started;
