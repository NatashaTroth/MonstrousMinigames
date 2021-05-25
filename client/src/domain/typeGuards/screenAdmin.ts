import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface ScreenAdminMessage {
    type: MessageTypes.screenAdmin;
}

export const screenAdminTypeGuard = (data: MessageData): data is ScreenAdminMessage =>
    (data as ScreenAdminMessage).type === MessageTypes.screenAdmin;
