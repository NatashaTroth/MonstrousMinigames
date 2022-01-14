import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface ChooseResponseMessage {
    type: MessageTypesGame2.chooseResponse;
    roomId: string;
    successfull: boolean;
}

export const chooseResponseTypeGuard = (data: MessageDataGame2): data is ChooseResponseMessage =>
    (data as ChooseResponseMessage).type === MessageTypesGame2.chooseResponse;
