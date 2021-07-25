import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface User {
    id: string;
    name: string;
    roomId: string;
    number: number;
    characterNumber: number;
    active: boolean;
    ready: boolean;
}

export interface ConnectedUsersMessage {
    type: MessageTypes.connectedUsers;
    users?: User[];
}

export const connectedUsersTypeGuard = (data: MessageData): data is ConnectedUsersMessage =>
    (data as ConnectedUsersMessage).type === MessageTypes.connectedUsers;
