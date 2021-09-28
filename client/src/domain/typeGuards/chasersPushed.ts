import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface ChasersPushedMessage {
    type: MessageTypes.chasersPushed;
}

export const ChasersPushedTypeGuard = (data: MessageData): data is ChasersPushedMessage =>
    (data as ChasersPushedMessage).type === MessageTypes.chasersPushed;
