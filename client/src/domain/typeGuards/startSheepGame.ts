import { MessageTypesGame2 } from '../../utils/constants';
import { MessageDataGame2 } from './MessageDataGame2';

export interface StartSheepGameMessage {
    type: MessageTypesGame2.startSheepGame;
    countdownTime: number;
}

export const startSheepGameTypeGuard = (data: MessageDataGame2): data is StartSheepGameMessage =>
    (data as StartSheepGameMessage).type === MessageTypesGame2.startSheepGame;
