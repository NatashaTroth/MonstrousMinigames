import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface GameHasResumedMessage {
    type: MessageTypes.gameHasResumed;
}

export const resumedTypeGuard = (data: MessageData): data is GameHasResumedMessage =>
    (data as GameHasResumedMessage).type === MessageTypes.gameHasResumed;
