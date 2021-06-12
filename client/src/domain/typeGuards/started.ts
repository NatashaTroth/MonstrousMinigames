import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface GameHasStartedMessage {
    type: MessageTypes.started;
    countdownTime: number;
}

export const startedTypeGuard = (data: MessageData): data is GameHasStartedMessage =>
    (data as GameHasStartedMessage).type === MessageTypes.started;
