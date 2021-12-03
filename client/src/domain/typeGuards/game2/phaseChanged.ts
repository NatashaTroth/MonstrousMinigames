import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface PhaseChangedMessage {
    type: MessageTypesGame2.phaseChanged;
    roomId: string;
    round: number;
    phase: 'counting' | 'guessing' | 'results';
}

export const phaseChangedTypeGuard = (data: MessageDataGame2): data is PhaseChangedMessage =>
    (data as PhaseChangedMessage).type === MessageTypesGame2.phaseChanged;
