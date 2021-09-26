import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ScreenStateMessage {
    type: MessageTypes.screenState;
    state: string;
}

export const screenStateTypeGuard = (data: MessageData): data is ScreenStateMessage =>
    (data as ScreenStateMessage).type === MessageTypes.screenState;
