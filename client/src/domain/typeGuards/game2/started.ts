import { MessageTypes } from '../../../utils/constants';
import { MessageDataGame2 } from '../MessageDataGame2';

export interface SheepGameHasStartedMessage {
    type: MessageTypes.gameHasStarted;
    countdownTime: number;
}

export const sheepGameStartedTypeGuard = (data: MessageDataGame2): data is SheepGameHasStartedMessage =>
    (data as SheepGameHasStartedMessage).type === MessageTypes.gameHasStarted;
