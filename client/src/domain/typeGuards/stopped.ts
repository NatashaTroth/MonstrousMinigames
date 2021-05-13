import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface GameHasStoppedMessage {
    type: MessageTypes.gameHasStopped;
}

export const stoppedTypeGuard = (data: MessageData): data is GameHasStoppedMessage =>
    (data as GameHasStoppedMessage).type === MessageTypes.gameHasStopped;
