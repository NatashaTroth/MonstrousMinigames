import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface GameHasResumedMessage {
    type: MessageTypes.gameHasResumed;
}

export const resumedTypeGuard = (data: MessageData): data is GameHasResumedMessage =>
    (data as GameHasResumedMessage).type === MessageTypes.gameHasResumed;
