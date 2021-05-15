import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface IUser {
    id: string;
    name: string;
    roomId: string;
    number: number;
}

export interface ConnectedUsersMessage {
    type: MessageTypes.connectedUsers;
    users?: IUser[];
}

export const connectedUsersTypeGuard = (data: MessageData): data is ConnectedUsersMessage =>
    (data as ConnectedUsersMessage).type === MessageTypes.connectedUsers;
