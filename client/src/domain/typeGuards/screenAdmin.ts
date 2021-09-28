import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ScreenAdminMessage {
    type: MessageTypes.screenAdmin;
    isAdmin: boolean;
}

export const screenAdminTypeGuard = (data: MessageData): data is ScreenAdminMessage =>
    (data as ScreenAdminMessage).type === MessageTypes.screenAdmin;
