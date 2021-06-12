import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface GameHasStoppedMessage {
    type: MessageTypes.gameHasStopped;
}

export const stoppedTypeGuard = (data: MessageData): data is GameHasStoppedMessage =>
    (data as GameHasStoppedMessage).type === MessageTypes.gameHasStopped;
