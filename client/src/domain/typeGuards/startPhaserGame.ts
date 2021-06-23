import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface StartPhaserGameMessage {
    type: MessageTypes.startPhaserGame;
}

export const startPhaserGameTypeGuard = (data: MessageData): data is StartPhaserGameMessage =>
    (data as StartPhaserGameMessage).type === MessageTypes.startPhaserGame;
