import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface GameHasResetMessage {
    type: MessageTypes.gameHasReset;
}

export const resetTypeGuard = (data: MessageData): data is GameHasResetMessage =>
    (data as GameHasResetMessage).type === MessageTypes.gameHasReset;
