import { MessageTypes } from '../../utils/constants';
import { GameNames } from '../../utils/games';
import { MessageData } from './MessageData';

export interface GameSetMessage {
    type: MessageTypes.gameSet;
    game: GameNames;
}

export const gameSetTypeGuard = (data: MessageData): data is GameSetMessage =>
    (data as GameSetMessage).type === MessageTypes.gameSet;
