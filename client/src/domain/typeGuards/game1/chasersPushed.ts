import { MessageTypesGame1 } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface ChasersPushedMessage {
    type: MessageTypesGame1.chasersPushed;
}

export const ChasersPushedTypeGuard = (data: MessageData): data is ChasersPushedMessage =>
    (data as ChasersPushedMessage).type === MessageTypesGame1.chasersPushed;
