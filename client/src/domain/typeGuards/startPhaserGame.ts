import { MessageTypesGame1 } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface StartPhaserGameMessage {
    type: MessageTypesGame1.startPhaserGame;
}

export const startPhaserGameTypeGuard = (data: MessageData): data is StartPhaserGameMessage =>
    (data as StartPhaserGameMessage).type === MessageTypesGame1.startPhaserGame;
