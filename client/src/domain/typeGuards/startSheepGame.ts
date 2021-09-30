import { MessageTypesGame2 } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface StartSheepGameMessage {
    type: MessageTypesGame2.startSheepGame;
}

export const startSheepGameTypeGuard = (data: MessageData): data is StartSheepGameMessage =>
    (data as StartSheepGameMessage).type === MessageTypesGame2.startSheepGame;
