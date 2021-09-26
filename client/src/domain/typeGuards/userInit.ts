import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface UserInitMessage {
    name: string;
    type: MessageTypes.userInit;
    userId: string;
    roomId: string;
    isAdmin: boolean;
    number: number;
    ready: boolean;
}

export const userInitTypeGuard = (data: MessageData): data is UserInitMessage =>
    (data as UserInitMessage).type === MessageTypes.userInit;
