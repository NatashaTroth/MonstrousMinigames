import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface GameHasResetMessage {
    type: MessageTypes.gameHasReset;
}

export const resetTypeGuard = (data: MessageData): data is GameHasResetMessage =>
    (data as GameHasResetMessage).type === MessageTypes.gameHasReset;
