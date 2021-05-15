import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface UserInitMessage {
    name: string;
    type: MessageTypes.userInit;
    userId: string;
    roomId: string;
    isAdmin: boolean;
    number: number;
}

export const userInitTypeGuard = (data: MessageData): data is UserInitMessage =>
    (data as UserInitMessage).type === MessageTypes.userInit;
