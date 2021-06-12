import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ErrorMessage {
    type: MessageTypes.error;
    name: string;
}

export const errorTypeGuard = (data: MessageData): data is ErrorMessage =>
    (data as ErrorMessage).type === MessageTypes.error;
