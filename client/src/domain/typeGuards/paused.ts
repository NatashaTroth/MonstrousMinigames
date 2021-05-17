import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface GameHasPausedMessage {
    type: MessageTypes.gameHasPaused;
}

export const pausedTypeGuard = (data: MessageData): data is GameHasPausedMessage =>
    (data as GameHasPausedMessage).type === MessageTypes.gameHasPaused;
