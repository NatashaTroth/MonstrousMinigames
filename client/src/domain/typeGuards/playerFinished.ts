import { MessageTypes } from '../../utils/constants';
import { MessageData } from './MessageData';

export interface PlayerFinishedMessage {
    type: MessageTypes.playerFinished;
    rank: number;
    userId: number;
}

export const playerFinishedTypeGuard = (data: MessageData): data is PlayerFinishedMessage =>
    (data as PlayerFinishedMessage).type === MessageTypes.playerFinished;
