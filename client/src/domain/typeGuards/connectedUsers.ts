import { MessageTypes } from '../../utils/constants';
import { MessageData } from '../socket/screen/handleSetSocket';

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
