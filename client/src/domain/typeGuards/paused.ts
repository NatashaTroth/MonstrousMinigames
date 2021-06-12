import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface GameHasPausedMessage {
    type: MessageTypes.gameHasPaused;
}

export const pausedTypeGuard = (data: MessageData): data is GameHasPausedMessage =>
    (data as GameHasPausedMessage).type === MessageTypes.gameHasPaused;
