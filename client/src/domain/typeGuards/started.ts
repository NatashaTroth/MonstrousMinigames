import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface GameHasStartedMessage {
    type: MessageTypes.started;
    countdownTime: number;
}

export const startedTypeGuard = (data: MessageData): data is GameHasStartedMessage =>
    (data as GameHasStartedMessage).type === MessageTypes.started;
