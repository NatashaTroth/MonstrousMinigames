import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface ErrorMessage {
    type: MessageTypes.error;
    name: string;
}

export const errorTypeGuard = (data: MessageData): data is ErrorMessage =>
    (data as ErrorMessage).type === MessageTypes.error;
