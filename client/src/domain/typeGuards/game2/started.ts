import { MessageTypes } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface SheepGameHasStartedMessage {
    type: MessageTypes.gameHasStarted;
    countdownTime: number;
}

export const sheepGameStartedTypeGuard = (data: MessageData): data is SheepGameHasStartedMessage =>
    (data as SheepGameHasStartedMessage).type === MessageTypes.gameHasStarted;
