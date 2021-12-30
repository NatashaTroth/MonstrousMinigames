import { GamePhases } from '../../../contexts/game2/Game2ContextProvider';
import { MessageTypesGame2 } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface PhaseChangedMessage {
    type: MessageTypesGame2.phaseChanged;
    roomId: string;
    round: number;
    phase: GamePhases;
}

export const phaseChangedTypeGuard = (data: MessageDataGame2): data is PhaseChangedMessage =>
    (data as PhaseChangedMessage).type === MessageTypesGame2.phaseChanged;
