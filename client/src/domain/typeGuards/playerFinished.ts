import { MessageData } from '../../contexts/ControllerSocketContextProvider';
import { MessageTypes } from '../../utils/constants';

export interface PlayerFinishedMessage {
    type: MessageTypes.playerFinished;
    rank: number;
    userId: number;
}

export const playerFinishedTypeGuard = (data: MessageData): data is PlayerFinishedMessage =>
    (data as PlayerFinishedMessage).type === MessageTypes.playerFinished;
