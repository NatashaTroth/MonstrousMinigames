import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { GameStateData } from '../../contexts/ScreenSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface TimedOutMessage {
    type: MessageTypes.gameHasTimedOut;
    rank: number;
    data: GameStateData;
}

export const timedOutTypeGuard = (data: MessageData): data is TimedOutMessage =>
    (data as TimedOutMessage).type === MessageTypes.gameHasTimedOut;
