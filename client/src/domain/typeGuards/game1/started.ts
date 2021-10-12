import { GameNames } from '../../../config/games';
import { MessageTypes } from '../../../utils/constants';
import { MessageData } from '../MessageData';

export interface GameHasStartedMessage {
    type: MessageTypes.gameHasStarted;
    countdownTime: number;
    game: GameNames;
}

export const startedTypeGuard = (data: MessageData): data is GameHasStartedMessage =>
    (data as GameHasStartedMessage).type === MessageTypes.gameHasStarted;
